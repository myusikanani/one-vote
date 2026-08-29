const localtunnel = require("localtunnel");
const https = require("https");

function getPublicIp() {
  return new Promise((resolve) => {
    https.get("https://api.ipify.org?format=json", (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data).ip);
        } catch {
          resolve("Unavailable");
        }
      });
    }).on("error", () => resolve("Unavailable"));
  });
}

async function startTunnel(port = 5000) {
  console.log("\n=======================================================");
  console.log("🌐 STARTING PUBLIC LINK FOR ONE VOTE PROTOTYPE...");
  console.log("=======================================================");

  const ip = await getPublicIp();

  try {
    const tunnel = await localtunnel({ port });

    console.log("\n✅ PUBLIC URL CREATED SUCCESSFULLY!");
    console.log(`🔗 Public Link: ${tunnel.url}`);
    if (ip && ip !== "Unavailable") {
      console.log(`🔑 Tunnel Password (if requested on first visit): ${ip}`);
    }
    console.log("\nShare this link to let anyone test the voting prototype from anywhere!");
    console.log("=======================================================\n");

    tunnel.on("close", () => {
      console.log("⚠️ Tunnel connection closed. Reconnecting in 3s...");
      setTimeout(() => startTunnel(port), 3000);
    });

    tunnel.on("error", (err) => {
      console.error("Tunnel error:", err.message);
    });
  } catch (err) {
    console.error("Failed to start tunnel:", err.message);
    console.log("Retrying in 5s...");
    setTimeout(() => startTunnel(port), 5000);
  }
}

const PORT = process.env.PORT || 5000;
startTunnel(PORT);
