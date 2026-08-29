const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function createSinglePagePdf() {
  const doc = new PDFDocument({
    size: "A4", // 595.28 x 841.89 pt
    margins: { top: 30, bottom: 20, left: 42, right: 42 },
    autoFirstPage: true
  });

  const outputPath = path.join(__dirname, "DVAS_Project_Summary_SinglePage.pdf");
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const primaryColor = "#0B3B6F";
  const darkTextColor = "#1A202C";
  const mutedTextColor = "#4A5568";
  const borderColor = "#CBD5E0";
  const problemBg = "#FFFBEB";
  const problemBorder = "#D97706";
  const solutionBg = "#F0F7FF";
  const solutionBorder = "#0B3B6F";

  const pageWidth = 595.28;
  const contentWidth = pageWidth - 84; // 511.28

  // 1. Header
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor(primaryColor)
    .text("DVAS — ONE VOTER ID, ANYWHERE VOTING", 42, 34, { width: contentWidth, align: "center" });

  doc
    .fontSize(10.5)
    .font("Helvetica-Bold")
    .fillColor(mutedTextColor)
    .text("Project Summary", 42, 56, { width: contentWidth, align: "center" });

  // 2. Info Table Box
  const tableY = 74;
  const rowHeight = 18;
  const tableHeight = rowHeight * 3;

  doc.rect(42, tableY, contentWidth, tableHeight).strokeColor(borderColor).stroke();

  const rows = [
    { label: "Project Name", value: "DVAS — One Voter ID, Anywhere Voting" },
    { label: "Submitted By", value: "Kanani Myusi Udaybhai" },
    { label: "Project Guide", value: "Dr. Shruti Suman" }
  ];

  rows.forEach((r, idx) => {
    const y = tableY + idx * rowHeight;
    doc.rect(42, y, 130, rowHeight).fillAndStroke("#F8FAFC", borderColor);
    doc.rect(172, y, contentWidth - 130, rowHeight).strokeColor(borderColor).stroke();

    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(darkTextColor).text(r.label, 48, y + 5);
    doc.font("Helvetica").fontSize(8.5).fillColor(darkTextColor).text(r.value, 178, y + 5);
  });

  // 3. Problem Statement Section
  const psY = tableY + tableHeight + 10;
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(primaryColor).text("Problem Statement", 42, psY);
  
  const problemBoxY = psY + 14;
  const problemText = "Eligible voters who are away from their registered polling location may miss voting, while allowing access from another location without synchronized status can create a risk of duplicate voting.";
  
  doc.rect(42, problemBoxY, contentWidth, 26).fillAndStroke(problemBg, borderColor);
  doc.rect(42, problemBoxY, 3.5, 26).fill(problemBorder);
  doc.font("Helvetica").fontSize(8.5).fillColor(darkTextColor).text(problemText, 52, problemBoxY + 5, { width: contentWidth - 20 });

  // 4. Solution in One Line Section
  const solY = problemBoxY + 34;
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(primaryColor).text("Solution in One Line", 42, solY);
  
  const solutionBoxY = solY + 14;
  const solutionText = "DVAS verifies synthetic voter eligibility and central voting status, creates a short-lived one-time authorization, blocks repeat attempts across demo locations, and keeps voter identity separate from anonymous vote records.";

  doc.rect(42, solutionBoxY, contentWidth, 26).fillAndStroke(solutionBg, borderColor);
  doc.rect(42, solutionBoxY, 3.5, 26).fill(solutionBorder);
  doc.font("Helvetica").fontSize(8.5).fillColor(darkTextColor).text(solutionText, 52, solutionBoxY + 5, { width: contentWidth - 20 });

  // 5. 250-Word Summary Section
  const sumY = solutionBoxY + 34;
  doc.font("Helvetica-Bold").fontSize(10).fillColor(primaryColor).text("Project Summary (232 words)", 42, sumY);

  const paragraphs = [
    "One Voter ID—Anywhere Voting improves electoral access while protecting security and privacy. Eligible voters may be away from their registered polling location on election day because of work, education, or travel. Our prototype demonstrates how an authorized location verifies synthetic voter identity, confirms eligibility, and checks central status before allowing one voting session.",
    "When a voter is eligible and marked NOT_VOTED, the system issues a single-use session. Once voting is completed, status changes immediately to VOTED. If the same voter ID is attempted from another demo location, such as Surat after Ahmedabad, the system blocks the second attempt, preventing duplicate voting.",
    "The project does not replace certified EVMs; the simulated voting screen exists only to demonstrate the end-to-end journey without connecting to live electoral infrastructure. Privacy is protected through decoupled data separation: the Voter Status Ledger stores synthetic identity and voting status, while the Anonymous Vote Vault records candidate selections with zero voter linkage.",
    "Multilingual voice guidance in Gujarati, Hindi, and English ensures accessibility for first-time and elderly voters. Built-in AI tools provide staff guidance and real-time anomaly alerts without accessing ballot choices, delivering a secure, inclusive, and practical civic prototype."
  ];

  let currentY = sumY + 16;
  paragraphs.forEach((p) => {
    doc
      .font("Helvetica")
      .fontSize(8.8)
      .fillColor(darkTextColor)
      .text(p, 42, currentY, { width: contentWidth, align: "justify", lineGap: 1.5 });
    
    currentY += doc.heightOfString(p, { width: contentWidth, lineGap: 1.5 }) + 8;
  });

  // 6. Footer Section (Pinned to bottom of page 1)
  const footerLineY = 780;
  doc
    .moveTo(42, footerLineY)
    .lineTo(pageWidth - 42, footerLineY)
    .strokeColor("#E2E8F0")
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(mutedTextColor)
    .text("Synthetic Data Demonstration — Not connected to live government systems, Aadhaar, EPIC, or certified EVMs.", 42, footerLineY + 6, { width: contentWidth, align: "center" });

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor("#A0AEC0")
    .text("DVAS — One Voter ID, Anywhere Voting", 42, footerLineY + 20)
    .text("Page 1 of 1", pageWidth - 100, footerLineY + 20, { width: 58, align: "right" });

  doc.end();

  writeStream.on("finish", () => {
    console.log("PDF created successfully at:", outputPath);
  });
}

createSinglePagePdf();
