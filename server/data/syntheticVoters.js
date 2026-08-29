/**
 * Synthetic Voter Database for Civic Hackathon Prototype
 * DISCLAIMER: SYNTHETIC DATA ONLY. No Aadhaar, EPIC, real voter data, government API or live EVM connection.
 */

const INITIAL_SYNTHETIC_VOTERS = [
  {
    voterId: "DEMO-V101",
    voterAuditRef: "VTR-7A29",
    name: "Rameshbhai Patel",
    nameGujarati: "રમેશભાઈ પટેલ",
    age: 48,
    gender: "Male",
    registeredCity: "Ahmedabad",
    constituency: "GJ-07 Ahmedabad East",
    pollingStation: "St. Xavier's High School, Navrangpura",
    status: "NOT_VOTED", // ELIGIBLE, NOT_VOTED
    eligibility: {
      isEligible: true,
      reason: "Active Registered Citizen — Cross-District Anywhere Voting Cleared"
    },
    verificationHistory: [],
    currentToken: null
  },
  {
    voterId: "DEMO-V102",
    voterAuditRef: "VTR-4B81",
    name: "Priyaben Shah",
    nameGujarati: "પ્રિયાબેન શાહ",
    age: 32,
    gender: "Female",
    registeredCity: "Surat",
    constituency: "GJ-25 Surat Central",
    pollingStation: "Adajan Municipal School #14",
    status: "VOTED", // ELIGIBLE, VOTED (For testing instant duplicate block)
    eligibility: {
      isEligible: true,
      reason: "Ballot already registered at Surat Booth #212 at 09:42:18 IST"
    },
    previousVote: {
      timestamp: "2026-08-25T09:42:18+05:30",
      boothCity: "Surat",
      boothId: "BOOTH-SRT-212",
      terminalId: "TERM-SRT-09",
      cryptoSeal: "0x89f4...32c1b9"
    },
    verificationHistory: [
      {
        timestamp: "2026-08-25T09:40:02+05:30",
        boothCity: "Surat",
        action: "TOKEN_ISSUED"
      },
      {
        timestamp: "2026-08-25T09:42:18+05:30",
        boothCity: "Surat",
        action: "VOTE_CAST_COMPLETED"
      }
    ],
    currentToken: null
  },
  {
    voterId: "DEMO-V103",
    voterAuditRef: "VTR-9C14",
    name: "Vikramsinh Desai",
    nameGujarati: "વિક્રમસિંહ દેસાઈ",
    age: 56,
    gender: "Male",
    registeredCity: "Rajkot",
    constituency: "GJ-10 Rajkot West",
    pollingStation: "Kasturbha Vidyalaya, Race Course",
    status: "NOT_VOTED", // NOT_ELIGIBLE, NOT_VOTED
    eligibility: {
      isEligible: false,
      reason: "Voter roll verification required / Statutory cutoff eligibility check"
    },
    verificationHistory: [],
    currentToken: null
  },
  {
    voterId: "DEMO-V104",
    voterAuditRef: "VTR-2E55",
    name: "Ananya Mehta",
    nameGujarati: "અનન્યા મહેતા",
    age: 24,
    gender: "Female",
    registeredCity: "Vadodara",
    constituency: "GJ-18 Vadodara Central",
    pollingStation: "Sayajiganj Model School",
    status: "NOT_VOTED", // ELIGIBLE, NOT_VOTED
    eligibility: {
      isEligible: true,
      reason: "Active Registered Citizen — Cross-District Anywhere Voting Cleared"
    },
    verificationHistory: [],
    currentToken: null
  },
  {
    voterId: "DEMO-V105",
    voterAuditRef: "VTR-6F33",
    name: "Tariqbhai Khan",
    nameGujarati: "તારિકભાઈ ખાન",
    age: 39,
    gender: "Male",
    registeredCity: "Ahmedabad",
    constituency: "GJ-08 Ahmedabad West",
    pollingStation: "Paldi Community Hall Booth #4",
    status: "NOT_VOTED", // ELIGIBLE, NOT_VOTED
    eligibility: {
      isEligible: true,
      reason: "Active Registered Citizen — Multi-Booth Anomaly Monitoring Active"
    },
    anomalyFlag: {
      riskLevel: "HIGH",
      reason: "Possible unusual verification pattern detected across Ahmedabad & Surat in under 8 minutes",
      details: "Possible unusual verification pattern detected. Supervisor review recommended."
    },
    verificationHistory: [
      { timestamp: "2026-08-25T11:51:10+05:30", boothCity: "Ahmedabad", action: "VERIFY_ATTEMPT" },
      { timestamp: "2026-08-25T11:54:22+05:30", boothCity: "Surat", action: "VERIFY_ATTEMPT" },
      { timestamp: "2026-08-25T11:58:05+05:30", boothCity: "Ahmedabad", action: "VERIFY_ATTEMPT" }
    ],
    currentToken: null
  }
];

const SYNTHETIC_CANDIDATES = [
  {
    id: "CAND-01",
    name: "Aarav K. Patel",
    nameGujarati: "આરવ કે. પટેલ",
    party: "Progressive Civic Front (PCF)",
    partyGujarati: "પ્રગતિશીલ નાગરિક મોરચો",
    symbol: "🌳",
    symbolEmoji: "🌳",
    symbolName: "Banyan Tree / વડનું વૃક્ષ",
    color: "#16a34a",
    serialNo: 1,
    audioText: "Candidate number 1: Aarav Patel. Progressive Civic Front. Symbol: Banyan Tree.",
    audioTextGujarati: "ઉમેદવાર નંબર 1: આરવ પટેલ. પ્રગતિશીલ નાગરિક મોરચો. પ્રતીક: વડનું વૃક્ષ."
  },
  {
    id: "CAND-02",
    name: "Bhavna S. Joshi",
    nameGujarati: "ભાવના એસ. જોશી",
    party: "Clean Governance Alliance (CGA)",
    partyGujarati: "સ્વચ્છ શાસન ગઠબંધન",
    symbol: "☀️",
    symbolEmoji: "☀️",
    symbolName: "Rising Sun / ઉગતો સૂર્ય",
    color: "#ea580c",
    serialNo: 2,
    audioText: "Candidate number 2: Bhavna Joshi. Clean Governance Alliance. Symbol: Rising Sun.",
    audioTextGujarati: "ઉમેદવાર નંબર 2: ભાવના જોશી. સ્વચ્છ શાસન ગઠબંધન. પ્રતીક: ઉગતો સૂર્ય."
  },
  {
    id: "CAND-03",
    name: "Dharmesh N. Varma",
    nameGujarati: "ધર્મેશ એન. વર્મા",
    party: "United Democratic Peoples Party (UDPP)",
    partyGujarati: "યુનાઈટેડ ડેમોક્રેટિક પીપલ્સ પાર્ટી",
    symbol: "⚙️",
    symbolEmoji: "⚙️",
    symbolName: "Industrial Wheel / ઔદ્યોગિક ચક્ર",
    color: "#2563eb",
    serialNo: 3,
    audioText: "Candidate number 3: Dharmesh Varma. United Democratic Peoples Party. Symbol: Industrial Wheel.",
    audioTextGujarati: "ઉમેદવાર નંબર 3: ધર્મેશ વર્મા. યુનાઈટેડ ડેમોક્રેટિક પીપલ્સ પાર્ટી. પ્રતીક: ઔદ્યોગિક ચક્ર."
  },
  {
    id: "CAND-04",
    name: "Kiranbhai R. Solanki",
    nameGujarati: "કિરણભાઈ આર. સોલંકી",
    party: "Gujarat Jan Seva Dal (GJSD)",
    partyGujarati: "ગુજરાત જન સેવા દળ",
    symbol: "🌾",
    symbolEmoji: "🌾",
    symbolName: "Golden Harvest / સુવર્ણ કણસ",
    color: "#ca8a04",
    serialNo: 4,
    audioText: "Candidate number 4: Kiranbhai Solanki. Gujarat Jan Seva Dal. Symbol: Golden Harvest.",
    audioTextGujarati: "ઉમેદવાર નંબર 4: કિરણભાઈ સોલંકી. ગુજરાત જન સેવા દળ. પ્રતીક: સુવર્ણ કણસ."
  },
  {
    id: "CAND-NOTA",
    name: "None of the Above (NOTA)",
    nameGujarati: "ઉપરોક્તમાંથી કોઈ નહીં (NOTA)",
    party: "Constitutional Option",
    partyGujarati: "બંધારણીય વિકલ્પ",
    symbol: "❌",
    symbolEmoji: "❌",
    symbolName: "NOTA Cross / અસ્વીકાર",
    color: "#dc2626",
    serialNo: 5,
    audioText: "Candidate number 5: None of the Above, NOTA.",
    audioTextGujarati: "ઉમેદવાર નંબર 5: ઉપરોક્તમાંથી કોઈ નહીં, નોટા."
  }
];

const POLLING_BOOTHS = [
  { city: "Ahmedabad", boothId: "BOOTH-AMD-104", name: "Navrangpura Civic Center Booth #104", district: "Ahmedabad Urban" },
  { city: "Surat", boothId: "BOOTH-SRT-212", name: "Adajan Multi-Purpose Hall Booth #212", district: "Surat Central" },
  { city: "Rajkot", boothId: "BOOTH-RJK-045", name: "Race Course Civic Terminal Booth #045", district: "Rajkot West" },
  { city: "Vadodara", boothId: "BOOTH-VAD-318", name: "Sayajiganj Urban Polling Booth #318", district: "Vadodara Metro" }
];

module.exports = {
  INITIAL_SYNTHETIC_VOTERS,
  SYNTHETIC_CANDIDATES,
  POLLING_BOOTHS
};
