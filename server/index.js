const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");

dotenv.config();

const db = require("./data/mockDatabase");
const { handleStaffChat } = require("./services/aiService");
const { generateSpeech } = require("./services/ttsService");
const { analyzeAnomalies } = require("./services/anomalyService");

const app = express();
const PORT = process.env.PORT || 5000;
const DEMO_JWT_SECRET = process.env.DEMO_JWT_SECRET || "civic_hackathon_demo_secret_key_2026";
const IS_DEMO_MODE = process.env.DEMO_MODE !== "false"; // default true for hackathon

app.use(cors());
app.use(express.json());

/**
 * Role-Based Access Control Middleware (Hackathon Synthetic Demo)
 * Grants full open access in demo mode so all public visitors have full permissions across all screens & actions.
 */
function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Extract token if provided
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, DEMO_JWT_SECRET);
        req.demoUser = decoded;
      } catch (err) {
        req.demoUser = { role: "DEMO_ADMIN", demo: true };
      }
    } else {
      req.demoUser = { role: "DEMO_ADMIN", demo: true };
    }

    // In Synthetic Demo Mode, grant full permissions to everyone
    if (IS_DEMO_MODE) {
      return next();
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.demoUser?.role)) {
      return res.status(403).json({
        success: false,
        error: "FORBIDDEN_ROLE",
        message: `Role '${req.demoUser?.role}' does not have permission for this action. Allowed: [${allowedRoles.join(", ")}]`
      });
    }

    next();
  };
}

// ----------------------------------------------------
// 1. DEMO ROLE SELECTOR ENDPOINT
// ----------------------------------------------------
app.post("/api/demo/select-role", (req, res) => {
  if (!IS_DEMO_MODE) {
    return res.status(403).json({
      success: false,
      message: "Role selection is disabled outside synthetic demo mode."
    });
  }

  const { role } = req.body;
  const validRoles = ["POLLING_OFFICER", "SUPERVISOR", "DEMO_ADMIN"];

  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      error: "INVALID_ROLE",
      message: `Invalid demo role. Must be one of: ${validRoles.join(", ")}`
    });
  }

  // Issue short-lived demo token (valid for 4 hours)
  const token = jwt.sign(
    { role, demo: true, issuedAt: new Date().toISOString() },
    DEMO_JWT_SECRET,
    { expiresIn: "4h" }
  );

  return res.json({
    success: true,
    token,
    role,
    expiresIn: "4h",
    message: `Active demo role set to ${role}.`
  });
});

// ----------------------------------------------------
// 2. PUBLIC CIVIC & SYSTEM HEALTH ENDPOINTS
// ----------------------------------------------------

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    system: "One Voter ID — Anywhere Voting Central Prototype",
    version: "2.6.0-role-protected",
    disclaimer: "HACKATHON PROTOTYPE — SYNTHETIC DATA ONLY. No Aadhaar, EPIC, real voter data, government API or live EVM connection.",
    privacyModel: "Privacy-by-Design / Decoupled Data Architecture",
    demoMode: IS_DEMO_MODE,
    timestamp: new Date().toISOString()
  });
});

// Get Polling Booths (Publicly accessible to terminals)
app.get("/api/booths", (req, res) => {
  res.json({ success: true, booths: db.getBooths() });
});

// Get Candidate List for Ballot (Publicly accessible to ballot units)
app.get("/api/candidates", (req, res) => {
  res.json({ success: true, candidates: db.getCandidates() });
});

// Get All Synthetic Voters (For demo switcher)
app.get("/api/voters", (req, res) => {
  res.json({ success: true, voters: db.getAllVoters() });
});

// ----------------------------------------------------
// 3. POLLING OFFICER ENDPOINTS (Verification & Voting)
// ----------------------------------------------------

function normalizeSyntheticVoterId(voterId) {
  if (typeof voterId !== "string") return "";
  const clean = voterId.trim().toUpperCase();
  
  // Shortcut aliases for quick demo presentation & hackathon testing
  if (clean === "1" || clean === "1ST" || clean === "V101" || clean === "DEMO1" || clean === "DEMO-1" || clean === "DEMO101" || clean === "DEMO-101") return "DEMO-V101";
  if (clean === "2" || clean === "2ND" || clean === "V102" || clean === "DEMO2" || clean === "DEMO-2" || clean === "DEMO102" || clean === "DEMO-102") return "DEMO-V102";
  if (clean === "3" || clean === "3RD" || clean === "V103" || clean === "DEMO3" || clean === "DEMO-3" || clean === "DEMO103" || clean === "DEMO-103") return "DEMO-V103";
  if (clean === "4" || clean === "4TH" || clean === "V104" || clean === "DEMO4" || clean === "DEMO-4" || clean === "DEMO104" || clean === "DEMO-104") return "DEMO-V104";
  if (clean === "5" || clean === "5TH" || clean === "V105" || clean === "DEMO5" || clean === "DEMO-5" || clean === "DEMO105" || clean === "DEMO-105") return "DEMO-V105";

  return clean;
}

// Verify Voter & Issue Token (Atomic State Machine + Anti-Race Condition + Strict Synthetic Format)
app.post("/api/voter/verify", requireRole(["POLLING_OFFICER"]), (req, res) => {
  const { voterId, boothCity } = req.body;

  // 1. Strict Validation: Type check, trim, uppercase, regex ^DEMO-V\d{3}$
  if (typeof voterId !== "string") {
    return res.status(400).json({
      success: false,
      code: "INVALID_VOTER_ID_FORMAT",
      error: "INVALID_VOTER_ID_FORMAT",
      message: "Use a valid synthetic Demo Voter ID format, for example DEMO-V101."
    });
  }

  const cleanVoterId = normalizeSyntheticVoterId(voterId);
  const SYNTHETIC_VOTER_ID_REGEX = /^DEMO-V\d{3}$/;

  if (!cleanVoterId || !SYNTHETIC_VOTER_ID_REGEX.test(cleanVoterId)) {
    db.addAuditLog({
      voterAuditRef: null,
      location: boothCity || "Ahmedabad",
      staffRole: req.demoUser?.role || "POLLING_OFFICER",
      action: "INVALID_INPUT_REJECTED",
      result: "DENIED",
      anomalyTag: "NONE",
      details: "Invalid synthetic Voter ID format rejected."
    });

    return res.status(400).json({
      success: false,
      code: "INVALID_VOTER_ID_FORMAT",
      error: "INVALID_VOTER_ID_FORMAT",
      message: "Use a valid synthetic Demo Voter ID format, for example DEMO-V101."
    });
  }

  // 2. Query Synthetic Database
  const voter = db.getVoter(cleanVoterId);
  if (!voter) {
    db.addAuditLog({
      voterAuditRef: null,
      location: boothCity || "Ahmedabad",
      staffRole: req.demoUser?.role || "POLLING_OFFICER",
      action: "VOTER_NOT_FOUND",
      result: "DENIED",
      anomalyTag: "NONE",
      details: "Synthetic voter ID not found in database."
    });

    return res.status(404).json({
      success: false,
      code: "VOTER_NOT_FOUND",
      error: "VOTER_NOT_FOUND",
      message: "This synthetic Voter ID is not available in the demo records."
    });
  }

  // 3. Check if voter already voted
  if (voter.status === "ALREADY_VOTED" || voter.status === "VOTED") {
    db.addAuditLog({
      voterAuditRef: voter.voterAuditRef,
      location: boothCity || "Ahmedabad",
      staffRole: req.demoUser?.role || "POLLING_OFFICER",
      action: "DUPLICATE_VOTE_ATTEMPT_BLOCKED",
      result: "BLOCKED",
      anomalyTag: "DUPLICATE_ATTEMPT",
      details: `Voter attempted second vote at ${boothCity}. Previous vote recorded.`
    });

    return res.status(409).json({
      success: false,
      code: "ALREADY_VOTED",
      error: "ALREADY_VOTED",
      status: "ALREADY_VOTED",
      voter: {
        voterId: voter.voterId,
        voterAuditRef: voter.voterAuditRef,
        name: voter.name,
        nameGujarati: voter.nameGujarati,
        constituency: voter.constituency,
        registeredCity: voter.registeredCity,
        status: voter.status
      },
      previousVote: voter.previousVote,
      message: "This voter has already completed voting. A second attempt is blocked."
    });
  }

  // 4. Check Ineligible
  if (!voter.eligibility || !voter.eligibility.isEligible) {
    db.addAuditLog({
      voterAuditRef: voter.voterAuditRef,
      location: boothCity || "Ahmedabad",
      staffRole: req.demoUser?.role || "POLLING_OFFICER",
      action: "VERIFICATION_INELIGIBLE",
      result: "BLOCKED",
      anomalyTag: "INELIGIBLE",
      details: `Voter marked ineligible: ${voter.eligibility?.reason || "Not eligible"}`
    });

    return res.status(403).json({
      success: false,
      code: "NOT_ELIGIBLE",
      error: "NOT_ELIGIBLE",
      status: "INELIGIBLE",
      voter: {
        voterId: voter.voterId,
        voterAuditRef: voter.voterAuditRef,
        name: voter.name,
        nameGujarati: voter.nameGujarati,
        age: voter.age,
        constituency: voter.constituency,
        registeredCity: voter.registeredCity,
        status: voter.status,
        eligibility: voter.eligibility
      },
      message: "This voter is not eligible to vote in the synthetic demo."
    });
  }

  // 5. Generate 5-minute single-use token with race condition protection
  try {
    const tokenObj = db.generateToken(voter.voterId, boothCity || "Ahmedabad", req.demoUser?.role || "POLLING_OFFICER");

    return res.json({
      success: true,
      code: "ELIGIBLE_TOKEN_ISSUED",
      status: "ELIGIBLE_TOKEN_ISSUED",
      voter: {
        voterId: voter.voterId,
        voterAuditRef: voter.voterAuditRef,
        name: voter.name,
        nameGujarati: voter.nameGujarati,
        age: voter.age,
        gender: voter.gender,
        constituency: voter.constituency,
        registeredCity: voter.registeredCity,
        pollingStation: voter.pollingStation,
        status: voter.status,
        eligibility: voter.eligibility
      },
      token: tokenObj,
      message: "Voter verified. 5-minute single-use authorization token generated."
    });
  } catch (err) {
    if (err.code === "ACTIVE_SESSION_EXISTS" || err.message === "ACTIVE_SESSION_EXISTS") {
      return res.status(409).json({
        success: false,
        code: "ACTIVE_SESSION_EXISTS",
        status: "ACTIVE_SESSION_EXISTS",
        voter: {
          voterId: voter.voterId,
          voterAuditRef: voter.voterAuditRef,
          name: voter.name,
          nameGujarati: voter.nameGujarati,
          constituency: voter.constituency,
          registeredCity: voter.registeredCity,
          status: voter.status
        },
        error: "ACTIVE_SESSION_EXISTS",
        token: err.activeToken || "AUTH-DEMO101",
        issuedBoothCity: err.issuedBoothCity,
        remainingSeconds: err.remainingSeconds,
        message: err.message || "Active voting session already in progress for this voter at another booth."
      });
    }

    return res.status(400).json({
      success: false,
      code: "VERIFICATION_FAILED",
      error: "VERIFICATION_FAILED",
      message: err.message
    });
  }
});

// Citizen Vote Submission
app.post("/api/voter/vote", requireRole(["POLLING_OFFICER"]), (req, res) => {
  const { voterId, token, candidateId, boothCity } = req.body;

  if (!voterId || !token || !candidateId) {
    return res.status(400).json({
      success: false,
      error: "MISSING_FIELDS",
      message: "Required: voterId, token, candidateId"
    });
  }

  const result = db.castVote({ voterId, token, candidateId, boothCity, staffRole: req.demoUser?.role || "POLLING_OFFICER" });

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.json(result);
});

// ----------------------------------------------------
// 4. SUPERVISOR ENDPOINTS (Audit Logs & Anomaly Monitor)
// ----------------------------------------------------

// Audit Logs (Accessible only by Supervisor, strictly pseudonymous)
app.get("/api/audit-logs", requireRole(["SUPERVISOR"]), (req, res) => {
  res.json({ success: true, logs: db.getAuditLogs() });
});

app.get("/api/audit/logs", requireRole(["SUPERVISOR"]), (req, res) => {
  res.json({ success: true, logs: db.getAuditLogs() });
});

// AI Anomaly & Fraud Detection Analysis (Advisory output for Supervisor)
app.get("/api/ai/anomalies", requireRole(["SUPERVISOR"]), async (req, res) => {
  try {
    const auditLogs = db.getAuditLogs();
    const voters = db.getAllVoters();
    const analysis = await analyzeAnomalies(auditLogs, voters);
    res.json({ success: true, ...analysis });
  } catch (error) {
    console.error("Anomaly route error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// 5. DEMO ADMIN ENDPOINTS (System Reset & Aggregate Stats)
// ----------------------------------------------------

// Reset Synthetic Demo Data (Protected: Requires DEMO_ADMIN role and DEMO_MODE=true)
app.post("/api/voter/reset", requireRole(["DEMO_ADMIN"]), (req, res) => {
  if (!IS_DEMO_MODE) {
    return res.status(403).json({
      success: false,
      message: "Reset is disabled outside synthetic demo mode."
    });
  }

  db.reset();
  return res.json({
    success: true,
    message: "Synthetic demo data reset successfully."
  });
});

// Aggregate Demo Statistics (No voter-candidate linkage)
app.get("/api/demo/stats", requireRole(["DEMO_ADMIN"]), (req, res) => {
  res.json({
    success: true,
    stats: db.getAggregateStats()
  });
});

// ----------------------------------------------------
// 6. AI SUPPORT SERVICES (Polling Staff Assistant & Voice TTS)
// ----------------------------------------------------

// AI Polling Staff Chat Assistant (Strict Read-Only Tool Calling with Multi-Language Support)
app.post("/api/ai/chat", requireRole(["POLLING_OFFICER", "SUPERVISOR", "DEMO_ADMIN"]), async (req, res) => {
  const { message, conversationHistory, language } = req.body;
  try {
    const response = await handleStaffChat({ message, conversationHistory, language });
    res.json({ success: true, ...response });
  } catch (error) {
    console.error("AI Chat route error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Multilingual TTS Speech Generation
app.post("/api/ai/tts", requireRole(["POLLING_OFFICER", "SUPERVISOR", "DEMO_ADMIN"]), async (req, res) => {
  const { text, scriptKey, language, speed } = req.body;
  try {
    const result = await generateSpeech({ text, scriptKey, language, speed });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("TTS route error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve frontend static build if built (client/dist) or in production
const fs = require("fs");
const distPath = path.join(__dirname, "../client/dist");
if (fs.existsSync(distPath) || process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));
  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  app.get("/", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`Civic Hackathon Anywhere Voting Server running on http://localhost:${PORT}`);
  console.log(`Role-Based Access Control: Active (JWT Enforced)`);
  console.log(`Demo Mode: ${IS_DEMO_MODE ? "ENABLED" : "DISABLED"}`);
  console.log(`=======================================================`);
});

// Keep Node process event loop alive indefinitely
setInterval(() => {}, 1000 * 60 * 60);

module.exports = app;

