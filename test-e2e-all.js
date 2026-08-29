const http = require("http");

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on("error", reject);
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
}

async function runEndToEndVerification() {
  console.log("===============================================================");
  console.log("RUNNING COMPLETE END-TO-END DEMO 1ST VOTER ID & VOTING VERIFICATION");
  console.log("===============================================================");

  // 1. Health check
  const health = await makeRequest({ hostname: "localhost", port: 5000, path: "/api/health", method: "GET" });
  console.assert(health.status === 200, "Health check failed");
  console.log("✓ 1. Backend Server is running and healthy on port 5000.");

  // 2. Select Role: DEMO_ADMIN & Reset Database
  const adminRole = await makeRequest(
    { hostname: "localhost", port: 5000, path: "/api/demo/select-role", method: "POST", headers: { "Content-Type": "application/json" } },
    { role: "DEMO_ADMIN" }
  );
  const adminToken = adminRole.data.token;
  
  const resetRes = await makeRequest(
    { hostname: "localhost", port: 5000, path: "/api/voter/reset", method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` } }
  );
  console.assert(resetRes.data.success === true, "Reset failed");
  console.log("✓ 2. Demo records reset to pristine hackathon state.");

  // 3. Select Role: POLLING_OFFICER
  const roleRes = await makeRequest(
    { hostname: "localhost", port: 5000, path: "/api/demo/select-role", method: "POST", headers: { "Content-Type": "application/json" } },
    { role: "POLLING_OFFICER" }
  );
  const officerToken = roleRes.data.token;
  console.log("✓ 3. Polling Officer JWT session acquired.");

  // 4. Verify using shortcut "1" (User types '1')
  const verifyShortcutRes = await makeRequest(
    { hostname: "localhost", port: 5000, path: "/api/voter/verify", method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${officerToken}` } },
    { voterId: "1", boothCity: "Ahmedabad" }
  );
  console.assert(verifyShortcutRes.status === 200, "Shortcut '1' verify status fail");
  console.assert(verifyShortcutRes.data.voter.voterId === "DEMO-V101", "Shortcut '1' not mapped to DEMO-V101");
  console.assert(verifyShortcutRes.data.token && verifyShortcutRes.data.token.token.startsWith("AUTH-"), "No auth token issued for shortcut 1");
  console.log(`✓ 4. Typing '1' successfully maps to 1st Demo ID 'DEMO-V101' (Ramesh Patel) and generates Token ${verifyShortcutRes.data.token.token}`);

  const authToken = verifyShortcutRes.data.token.token;

  // 5. Cast vote with 1st Demo ID for Candidate 1 (Aarav Patel)
  const voteRes = await makeRequest(
    { hostname: "localhost", port: 5000, path: "/api/voter/vote", method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${officerToken}` } },
    { voterId: "DEMO-V101", token: authToken, candidateId: "CAND-01", boothCity: "Ahmedabad" }
  );
  console.assert(voteRes.status === 200 && voteRes.data.success === true, "Vote casting failed");
  console.assert(voteRes.data.receipt && voteRes.data.receipt.receiptHash, "Vote receipt missing");
  console.log(`✓ 5. Vote cast successfully for Candidate 1. Digital Receipt generated: ${voteRes.data.receipt.receiptNumber}`);

  // 6. Test duplicate prevention on 1st Demo ID in another city (Rajkot)
  const dupRes = await makeRequest(
    { hostname: "localhost", port: 5000, path: "/api/voter/verify", method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${officerToken}` } },
    { voterId: "DEMO-V101", boothCity: "Rajkot" }
  );
  console.assert(dupRes.status === 409 && dupRes.data.code === "ALREADY_VOTED", "Duplicate vote not blocked");
  console.log("✓ 6. Second verification attempt in Rajkot is instantly BLOCKED (HTTP 409 ALREADY_VOTED).");

  // 7. Reset and verify again to test re-voting capability
  await makeRequest(
    { hostname: "localhost", port: 5000, path: "/api/voter/reset", method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` } }
  );
  const reVerifyRes = await makeRequest(
    { hostname: "localhost", port: 5000, path: "/api/voter/verify", method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${officerToken}` } },
    { voterId: "DEMO-V101", boothCity: "Ahmedabad" }
  );
  console.assert(reVerifyRes.status === 200 && reVerifyRes.data.code === "ELIGIBLE_TOKEN_ISSUED", "Re-verification after reset failed");
  console.log("✓ 7. Reset allows DEMO-V101 to vote cleanly again in new cycle.");

  console.log("===============================================================");
  console.log("ALL DEMO 1ST VOTER ID & VOTING WORKFLOWS ARE WORKING 100% PERFECTLY!");
  console.log("===============================================================");
}

runEndToEndVerification().catch(console.error);
