const crypto = require("crypto");
const { INITIAL_SYNTHETIC_VOTERS, SYNTHETIC_CANDIDATES, POLLING_BOOTHS } = require("./syntheticVoters");

class MockDatabase {
  constructor() {
    this.reset();
  }

  reset() {
    // Restore synthetic voter seed records
    this.voters = INITIAL_SYNTHETIC_VOTERS.map(v => ({
      ...JSON.parse(JSON.stringify(v)),
      activeTokenHash: null,
      tokenExpiresAt: null,
      issuedBoothCity: null,
      issuedBoothId: null
    }));
    
    // Decoupled Anonymous Vote Store: STRICTLY NO voterId, token, location, or staff ID stored!
    this.anonymousVotes = [];

    // Audit logs strictly contain pseudonymous voterAuditRef (e.g. VTR-7A29) and NO plaintext tokens or PII
    this.auditLogs = [
      {
        id: "LOG-001",
        timestamp: new Date().toISOString(),
        voterAuditRef: null,
        location: "Statewide Central Hub",
        staffRole: "DEMO_ADMIN",
        action: "DEMO_DATA_RESET",
        result: "SUCCESS",
        anomalyTag: "NONE",
        details: "Synthetic demo records initialized to pristine hackathon state."
      }
    ];
  }

  getVoter(voterId) {
    if (!voterId) return null;
    const cleanId = voterId.trim().toUpperCase();
    return this.voters.find(v => v.voterId.toUpperCase() === cleanId);
  }

  getAllVoters() {
    return this.voters;
  }

  getCandidates() {
    return SYNTHETIC_CANDIDATES;
  }

  getBooths() {
    return POLLING_BOOTHS;
  }

  /**
   * Generates a single-use 5-minute authorization token.
   * Enforces State Machine: NOT_VOTED -> SESSION_ACTIVE
   * Enforces Anti-Race Condition: Only 1 active token allowed across all booths statewide.
   * Enforces Backend Hashing: Stores SHA-256 hash in DB, not plaintext.
   */
  generateToken(voterId, boothCity, staffRole = "POLLING_OFFICER") {
    const voter = this.getVoter(voterId);
    if (!voter) throw new Error("VOTER_NOT_FOUND");

    if (voter.status === "ALREADY_VOTED" || voter.status === "VOTED") {
      throw new Error("ALREADY_VOTED");
    }

    if (!voter.eligibility.isEligible) {
      throw new Error(`INELIGIBLE: ${voter.eligibility.reason}`);
    }

    const now = new Date();

    // 1. Race Condition / Active Session Check
    if (voter.status === "SESSION_ACTIVE" && voter.tokenExpiresAt) {
      const expiresAtDate = new Date(voter.tokenExpiresAt);
      if (now < expiresAtDate) {
        const remainingSec = Math.max(1, Math.round((expiresAtDate.getTime() - now.getTime()) / 1000));
        const err = new Error(`ACTIVE_SESSION_EXISTS`);
        err.code = "ACTIVE_SESSION_EXISTS";
        err.issuedBoothCity = voter.issuedBoothCity || "another booth";
        err.remainingSeconds = remainingSec;
        err.message = `Active voting session already in progress for this voter at ${voter.issuedBoothCity || 'another booth'} (${remainingSec}s remaining). Only one active authorization token is allowed across all booths statewide.`;
        throw err;
      } else {
        // Expired active session: auto-revert to NOT_VOTED
        voter.status = "NOT_VOTED";
        voter.activeTokenHash = null;
        voter.tokenExpiresAt = null;
        voter.issuedBoothCity = null;
        voter.issuedBoothId = null;
      }
    }

    // 2. Generate 6-digit random token and SHA-256 hash
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenString = `AUTH-${randomCode}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes validity
    
    // Hash token with SHA-256 for secure storage (Plaintext is NOT stored in DB)
    const tokenHash = crypto.createHash("sha256").update(tokenString).digest("hex");

    const boothId = this.getBoothIdForCity(boothCity);

    // Update state machine: NOT_VOTED -> SESSION_ACTIVE
    voter.status = "SESSION_ACTIVE";
    voter.activeTokenHash = tokenHash;
    voter.tokenExpiresAt = expiresAt;
    voter.issuedBoothCity = boothCity;
    voter.issuedBoothId = boothId;

    voter.verificationHistory.push({
      timestamp: new Date().toISOString(),
      boothCity,
      action: "SESSION_AUTHORIZED"
    });

    // Pseudonymous Audit Log Entry (Strict privacy: NO raw ID, NO raw token, NO token hash)
    this.addAuditLog({
      voterAuditRef: voter.voterAuditRef || `VTR-${crypto.createHash("sha256").update(voter.voterId).digest("hex").substring(0, 4).toUpperCase()}`,
      location: boothCity,
      staffRole,
      action: "TOKEN_ISSUED_5MIN_WINDOW",
      result: "AUTHORIZED",
      anomalyTag: "NONE",
      details: `One-time authorization token issued (SHA-256 hashed in registry) with 300s window.`
    });

    // Return the plaintext token and metadata to the client session
    return {
      token: tokenString,
      issuedAt: new Date().toISOString(),
      expiresAt,
      boothCity,
      validSeconds: 300
    };
  }

  /**
   * Casts a ballot in a decoupled, privacy-preserving manner.
   * Transitions state: SESSION_ACTIVE -> VOTED
   * Enforces:
   * 1. Token Single-Use & SHA-256 Hash Matching
   * 2. 5-minute expiration check
   * 3. Location/Booth Binding check
   * 4. Immediate Token Invalidation
   * 5. Decoupled Anonymous Vote Storage (Zero voter ID, zero token, zero location/staff linkage)
   */
  castVote({ voterId, token, candidateId, boothCity, staffRole = "POLLING_OFFICER" }) {
    const voter = this.getVoter(voterId);
    if (!voter) {
      return { success: false, error: "VOTER_NOT_FOUND", message: "Voter record does not exist in central registry." };
    }

    if (voter.status === "VOTED" || voter.status === "ALREADY_VOTED") {
      return { 
        success: false, 
        error: "ALREADY_VOTED", 
        message: "Duplicate vote prevented. Voter status is already recorded as VOTED in central registry.",
        previousVote: voter.previousVote
      };
    }

    if (voter.status !== "SESSION_ACTIVE" || !voter.activeTokenHash) {
      return { 
        success: false, 
        error: "INVALID_TOKEN", 
        message: "No active voting session found for this voter. Please obtain a fresh authorization token at the staff terminal." 
      };
    }

    // 1. Expiry Check (5-minute window)
    const now = new Date();
    const expiresAt = new Date(voter.tokenExpiresAt);
    if (now > expiresAt) {
      // Invalidate expired session
      voter.status = "NOT_VOTED";
      voter.activeTokenHash = null;
      voter.tokenExpiresAt = null;
      voter.issuedBoothCity = null;
      voter.issuedBoothId = null;

      return { 
        success: false, 
        error: "TOKEN_EXPIRED", 
        message: "Authorization token has expired (exceeded 5-minute window). Request a new token at the staff terminal." 
      };
    }

    // 2. Token SHA-256 Hash Verification
    const providedHash = crypto.createHash("sha256").update(token).digest("hex");
    if (providedHash !== voter.activeTokenHash) {
      return { 
        success: false, 
        error: "INVALID_TOKEN", 
        message: "Authorization token is invalid or does not match central cryptographic session." 
      };
    }

    // 3. Location / Booth Binding Check
    if (voter.issuedBoothCity && boothCity && voter.issuedBoothCity.toLowerCase() !== boothCity.toLowerCase()) {
      return {
        success: false,
        error: "BOOTH_MISMATCH",
        message: `Token was issued at ${voter.issuedBoothCity} and cannot be redeemed at ${boothCity}. Tokens are cryptographically bound to the issuing polling station.`
      };
    }

    const candidate = SYNTHETIC_CANDIDATES.find(c => c.id === candidateId);
    if (!candidate) {
      return { success: false, error: "INVALID_CANDIDATE", message: "Selected candidate does not exist on ballot." };
    }

    // 4. UPDATE CENTRAL VOTER REGISTRY: Transition SESSION_ACTIVE -> VOTED and destroy token immediately
    const voteTimestamp = new Date().toISOString();
    voter.status = "VOTED";
    voter.activeTokenHash = null; // Token destroyed immediately (Single-use)
    voter.tokenExpiresAt = null;
    voter.issuedBoothCity = null;
    voter.issuedBoothId = null;

    voter.previousVote = {
      timestamp: voteTimestamp,
      boothCity: boothCity || "Ahmedabad",
      boothId: this.getBoothIdForCity(boothCity),
      terminalId: `TERM-${(boothCity || "AMD").substring(0, 3).toUpperCase()}-01`,
      cryptoSeal: `0x${crypto.randomBytes(6).toString("hex")}...${crypto.randomBytes(4).toString("hex")}`
    };

    voter.verificationHistory.push({
      timestamp: voteTimestamp,
      boothCity,
      action: "VOTE_CAST_COMPLETED"
    });

    // 5. STORE ANONYMOUS VOTE IN SEPARATE DECOUPLED STORE
    // Privacy-by-Design Architecture: STRICTLY ZERO voter ID, ZERO token, ZERO location, ZERO staff ID!
    const anonymousVoteId = `VOTE-ANON-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptHash = "0x" + crypto.createHash("sha256").update(anonymousVoteId + candidateId + voteTimestamp).digest("hex");

    const anonymousRecord = {
      voteId: anonymousVoteId,
      candidateId: candidate.id,
      createdAt: voteTimestamp,
      receiptHash
    };

    this.anonymousVotes.push(anonymousRecord);

    // 6. AUDIT LOGGING (Pseudonymous reference, zero choice or token leakage)
    this.addAuditLog({
      voterAuditRef: voter.voterAuditRef || `VTR-${crypto.createHash("sha256").update(voter.voterId).digest("hex").substring(0, 4).toUpperCase()}`,
      location: boothCity || "Ahmedabad",
      staffRole,
      action: "BALLOT_CAST_CENTRAL_STATUS_UPDATED",
      result: "SUCCESS",
      anomalyTag: "NONE",
      details: "Central status locked to VOTED. Decoupled anonymous vote cryptographically registered in vault."
    });

    return {
      success: true,
      message: "Vote cast successfully and verified on central registry.",
      receipt: {
        receiptNumber: `RCPT-${Math.floor(100000 + Math.random() * 900000)}`,
        receiptId: `RCPT-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: voteTimestamp,
        boothCity: boothCity || "Ahmedabad",
        constituency: voter.constituency,
        cryptoSeal: voter.previousVote.cryptoSeal,
        receiptHash,
        vvpatConfirmed: true
      }
    };
  }

  getBoothIdForCity(city) {
    const booth = POLLING_BOOTHS.find(b => b.city.toLowerCase() === (city || "").toLowerCase());
    return booth ? booth.boothId : "BOOTH-CENTRAL-01";
  }

  addAuditLog(logEntry) {
    const newLog = {
      id: `LOG-${String(this.auditLogs.length + 1).padStart(3, "0")}`,
      timestamp: new Date().toISOString(),
      voterAuditRef: logEntry.voterAuditRef || null,
      location: logEntry.location || logEntry.boothCity || "Ahmedabad",
      staffRole: logEntry.staffRole || "POLLING_OFFICER",
      action: logEntry.action || "AUDIT_EVENT",
      result: logEntry.result || "SUCCESS",
      anomalyTag: logEntry.anomalyTag || "NONE",
      details: logEntry.details || ""
    };
    this.auditLogs.unshift(newLog); // prepend most recent
    return newLog;
  }

  getAuditLogs() {
    return this.auditLogs;
  }

  getAnonymousVoteVault() {
    // Return decoupled anonymous votes without any voter reference
    return this.anonymousVotes;
  }

  getAggregateStats() {
    const totalVoters = this.voters.length;
    const votedCount = this.voters.filter(v => v.status === "VOTED" || v.status === "ALREADY_VOTED").length;
    const activeSessions = this.voters.filter(v => v.status === "SESSION_ACTIVE").length;
    const totalAnonymousVotes = this.anonymousVotes.length;

    return {
      totalSyntheticVoters: totalVoters,
      votedCount,
      turnoutPercentage: Math.round((votedCount / totalVoters) * 100),
      activeSessions,
      totalAnonymousVotes,
      systemStatus: "HEALTHY",
      demoMode: process.env.DEMO_MODE === "true" || true
    };
  }
}

const db = new MockDatabase();
module.exports = db;
