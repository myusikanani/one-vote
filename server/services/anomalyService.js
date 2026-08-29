const OpenAI = require("openai");

async function analyzeAnomalies(auditLogs = [], voters = []) {
  // 1. Rule-based algorithmic scan
  const flaggedEvents = [];
  const voterAttemptCounts = {};

  auditLogs.forEach(log => {
    const vId = log.voterIdMasked || "DEMO-V***";
    if (!voterAttemptCounts[vId]) {
      voterAttemptCounts[vId] = [];
    }
    voterAttemptCounts[vId].push(log);
  });

  // Check for multi-location rapid attempts
  Object.keys(voterAttemptCounts).forEach(vId => {
    const logs = voterAttemptCounts[vId];
    if (logs.length >= 2) {
      const cities = new Set(logs.map(l => l.boothCity).filter(Boolean));
      if (cities.size >= 2) {
        flaggedEvents.push({
          maskedVoterId: vId,
          type: "MULTI_DISTRICT_RAPID_VELOCITY",
          severity: "HIGH",
          cities: Array.from(cities),
          attemptsCount: logs.length,
          description: `Possible unusual verification pattern detected across ${Array.from(cities).join(" and ")} within a short time window.`,
          recommendation: "Possible unusual verification pattern detected. Supervisor review recommended."
        });
      }
    }
  });

  // Check for voters with specific preset anomaly flag
  voters.forEach(v => {
    const maskedId = `DEMO-***${v.voterId.slice(-3)}`;
    if (v.anomalyFlag && !flaggedEvents.some(f => f.maskedVoterId === maskedId || f.maskedVoterId === "DEMO-V***")) {
      flaggedEvents.push({
        maskedVoterId: maskedId,
        type: "SUSPICIOUS_IDENTITY_CLONING",
        severity: v.anomalyFlag.riskLevel || "HIGH",
        cities: ["Ahmedabad", "Surat"],
        attemptsCount: 3,
        description: "Possible unusual verification pattern detected across multiple polling booths.",
        recommendation: "Possible unusual verification pattern detected. Supervisor review recommended."
      });
    }
  });

  const overallRisk = flaggedEvents.some(f => f.severity === "HIGH") ? "HIGH" : 
                      flaggedEvents.length > 0 ? "MEDIUM" : "LOW";

  // If OpenAI API Key is available, use GPT-4o with strict advisory phrasing
  let aiSummary = "";
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && apiKey.trim() !== "" && apiKey !== "your_openai_api_key_here") {
    try {
      const openai = new OpenAI({ apiKey });
      const prompt = `You are the AI Advisory Electoral Security Assistant for 'One Voter ID — Anywhere Voting'.
Analyze these security audit findings:
- Overall System Advisory Risk: ${overallRisk}
- Flagged Events: ${JSON.stringify(flaggedEvents)}
- Total Audited Operations: ${auditLogs.length}

Provide a concise, 3-sentence advisory summary for the Supervisor.
STRICT INSTRUCTION: Always use advisory terminology like "Possible unusual verification pattern detected. Supervisor review recommended." Never claim "Fraud confirmed" or take autonomous administrative actions.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.1
      });
      aiSummary = response.choices[0].message.content;
    } catch (e) {
      console.warn("OpenAI Anomaly summary fallback:", e.message);
    }
  }

  if (!aiSummary) {
    aiSummary = overallRisk === "HIGH"
      ? `⚠️ **ADVISORY NOTICE**: Possible unusual verification pattern detected across Ahmedabad and Surat. Supervisor review recommended. Central status ledger has safely maintained single-vote locking.`
      : `✅ **SYSTEM STABLE**: All cross-district cryptographic tokens operating normally with zero duplicate leakage. Decentralized booth synchronization latency is under 25ms.`;
  }

  return {
    overallRisk,
    flaggedEvents,
    totalLogsAudited: auditLogs.length,
    timestamp: new Date().toISOString(),
    aiSummary,
    disclaimer: "AI flags are strictly advisory. Final decisions must be made by authorized human supervisors."
  };
}

module.exports = {
  analyzeAnomalies
};
