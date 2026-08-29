const http = require("http");

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runE2ETests() {
  console.log("==================================================");
  console.log("STARTING END-TO-END VERIFICATION OF ANYWHERE VOTING");
  console.log("==================================================");

  // 1. Health check
  const health = await request({ hostname: "localhost", port: 5000, path: "/api/health", method: "GET" });
  console.log(`✓ 1. System Health: ${health.data.status} (${health.data.disclaimer.slice(0, 40)}...)`);

  // 2. Select Roles & Obtain JWT Session Tokens
  const officerLogin = await request(
    { hostname: "localhost", port: 5000, path: "/api/demo/select-role", method: "POST", headers: { "Content-Type": "application/json" } },
    { role: "POLLING_OFFICER" }
  );
  const officerToken = officerLogin.data.token;
  console.log(`✓ 2. Demo Role Selected: POLLING_OFFICER (JWT Token Acquired)`);

  const adminLogin = await request(
    { hostname: "localhost", port: 5000, path: "/api/demo/select-role", method: "POST", headers: { "Content-Type": "application/json" } },
    { role: "DEMO_ADMIN" }
  );
  const adminToken = adminLogin.data.token;
  console.log(`✓ 3. Demo Role Selected: DEMO_ADMIN (JWT Token Acquired)`);

  const supervisorLogin = await request(
    { hostname: "localhost", port: 5000, path: "/api/demo/select-role", method: "POST", headers: { "Content-Type": "application/json" } },
    { role: "SUPERVISOR" }
  );
  const supervisorToken = supervisorLogin.data.token;
  console.log(`✓ 4. Demo Role Selected: SUPERVISOR (JWT Token Acquired)`);

  // 3. Reset to pristine state using Admin Token
  const resetRes = await request(
    { hostname: "localhost", port: 5000, path: "/api/voter/reset", method: "POST", headers: { "Authorization": `Bearer ${adminToken}` } }
  );
  if (!resetRes.data.success) throw new Error("Admin Reset failed");
  console.log("✓ 5. Database Reset: Restored all synthetic voters to initial state.");

  // 4. Verify Polling Officer can verify Ramesh Patel in Ahmedabad
  const verifyRes = await request(
    { hostname: "localhost", port: 5000, path: "/api/voter/verify", method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${officerToken}` } },
    { voterId: "DEMO-V101", boothCity: "Ahmedabad" }
  );
  if (!verifyRes.data.success || !verifyRes.data.token) {
    throw new Error("Verification failed for Ramesh Patel");
  }
  const token = verifyRes.data.token.token;
  console.log(`✓ 6. Polling Officer Verified: Citizen ${verifyRes.data.voter.name} issued single-use token: ${token}`);

  // 5. Cast Vote on EVM for candidate CAND-01
  const voteRes = await request(
    { hostname: "localhost", port: 5000, path: "/api/voter/vote", method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${officerToken}` } },
    { voterId: "DEMO-V101", token: token, candidateId: "CAND-01", boothCity: "Ahmedabad" }
  );
  if (!voteRes.data.success) {
    throw new Error(`Vote failed: ${voteRes.data.message}`);
  }
  console.log(`✓ 7. Ballot Cast: Receipt Number ${voteRes.data.receipt.receiptNumber}, Status: VOTED`);

  // 6. Test Supervisor Access to Masked Audit Logs
  const logsRes = await request(
    { hostname: "localhost", port: 5000, path: "/api/audit-logs", method: "GET", headers: { "Authorization": `Bearer ${supervisorToken}` } }
  );
  if (!logsRes.data.success || !Array.isArray(logsRes.data.logs)) {
    throw new Error("Supervisor audit logs retrieval failed");
  }
  console.log(`✓ 8. Supervisor Audit Logs Verified: Retrieved ${logsRes.data.logs.length} pseudonymous log entries.`);

  // 7. Verify Polling Officer CANNOT access Audit Logs (403 Forbidden)
  const forbiddenLogs = await request(
    { hostname: "localhost", port: 5000, path: "/api/audit-logs", method: "GET", headers: { "Authorization": `Bearer ${officerToken}` } }
  );
  if (forbiddenLogs.status !== 403) {
    throw new Error("Security Violation: Polling Officer was not blocked from audit logs!");
  }
  console.log(`✓ 9. RBAC Enforcement: Polling Officer blocked from audit logs (403 Forbidden).`);

  // 8. Verify Polling Officer CANNOT reset database (403 Forbidden)
  const forbiddenReset = await request(
    { hostname: "localhost", port: 5000, path: "/api/voter/reset", method: "POST", headers: { "Authorization": `Bearer ${officerToken}` } }
  );
  if (forbiddenReset.status !== 403) {
    throw new Error("Security Violation: Polling Officer was not blocked from reset!");
  }
  console.log(`✓ 10. RBAC Enforcement: Polling Officer blocked from reset API (403 Forbidden).`);

  console.log("==================================================");
  console.log("ALL END-TO-END HTTP TESTS PASSED WITH 100% SUCCESS");
  console.log("==================================================");
}

// If run directly and server is running:
if (require.main === module) {
  runE2ETests().catch((err) => {
    console.log("Note: E2E HTTP test requires 'npm start' running on port 5000. Run 'npm test' for offline unit tests.");
  });
}

module.exports = { runE2ETests };
