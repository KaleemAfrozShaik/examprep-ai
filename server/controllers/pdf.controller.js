import PDFDocument from "pdfkit";

// Helper to sanitize symbols to prevent "%Ï" and other rendering artifacts
const sanitizeForPDF = (text) => {
  if (!text) return "";
  return text
    .replace(/⭐⭐⭐/g, "High Weightage")
    .replace(/⭐⭐/g, "Important")
    .replace(/⭐/g, "Essential")
    .replace(/•/g, "-")
    .replace(/\u25CF/g, "-") // Remove solid bullet
    .replace(/\u2022/g, "-") // Remove bullet
    .replace(/[^\x00-\x7F]/g, ""); // Final safety check: remove all non-ASCII
};

export const pdfDownload = async (req, res) => {
  try {
    const { result } = req.body;

    if (!result) {
      return res.status(400).json({ message: "No content provided" });
    }

    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4',
      bufferPages: true,
      autoFirstPage: true
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="ExamPrepAI.pdf"',
    );

    doc.pipe(res);

    // --- 1. Header with Brand Colors ---
    doc.rect(0, 0, doc.page.width, 100).fill("#1E1B4B"); // Dark Indigo
    doc.fillColor("#FFFFFF").fontSize(26).font("Helvetica-Bold").text("ExamPrep AI", 50, 40);
    doc.fontSize(10).font("Helvetica").text("Powering Your Exam Success with Intelligence", 50, 70, { opacity: 0.8 });
    
    doc.moveDown(4);
    doc.fillColor("#000000");

    // Priority Banner
    const priority = sanitizeForPDF(result.importance);
    doc.rect(50, doc.y, 495, 25).fill("#F3F4F6");
    doc.fillColor("#374151").fontSize(10).font("Helvetica-Bold").text(`EXAM PRIORITY: ${priority.toUpperCase()}`, 65, doc.y - 18);
    doc.moveDown(2);

    // --- 2. Syllabus Breakdown ---
    doc.fillColor("#4F46E5").fontSize(16).font("Helvetica-Bold").text("Syllabus Breakdown");
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#E0E7FF").lineWidth(2).stroke();
    doc.moveDown(1);

    Object.entries(result.subTopics).forEach(([star, topics]) => {
      const category = sanitizeForPDF(star);
      doc.moveDown(0.2);
      doc.fontSize(11).font("Helvetica-Bold").fillColor("#4338CA").text(category);
      doc.fillColor("#374151").font("Helvetica");
      topics.forEach((t) => {
        doc.fontSize(10).text(`- ${sanitizeForPDF(t)}`, { indent: 15 });
      });
      doc.moveDown(0.5);
    });

    doc.moveDown(1);

    // --- 3. Detailed Study Material ---
    doc.fillColor("#4338CA").fontSize(16).font("Helvetica-Bold").text("Detailed Study Content");
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#E0E7FF").lineWidth(2).stroke();
    doc.moveDown(1);

    const noteLines = result.notes.split("\n");
    noteLines.forEach((line) => {
      const cleanLine = sanitizeForPDF(line.replace(/\*\*/g, "").replace(/\*/g, ""));
      if (!cleanLine.trim()) return;

      if (line.startsWith("###")) {
        doc.moveDown(0.4);
        doc.fillColor("#4B5563").fontSize(12).font("Helvetica-Bold").text(cleanLine.trim());
      } else if (line.startsWith("##")) {
        doc.moveDown(0.6);
        doc.fillColor("#1E1B4B").fontSize(14).font("Helvetica-Bold").text(cleanLine.trim());
      } else if (line.startsWith("#")) {
        doc.moveDown(0.8);
        doc.fillColor("#1E1B4B").fontSize(18).font("Helvetica-Bold").text(cleanLine.trim());
      } else {
        doc.fillColor("#374151").fontSize(10).font("Helvetica").text(cleanLine.trim(), {
          align: 'justify',
          lineGap: 2
        });
        doc.moveDown(0.15);
      }
    });

    // --- 4. Revision & Questions ---
    doc.moveDown(1.5);
    doc.fillColor("#4338CA").fontSize(16).font("Helvetica-Bold").text("Practice & Revision");
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#E0E7FF").lineWidth(2).stroke();
    doc.moveDown(1);

    if (result.questions.short?.length) {
      doc.fillColor("#1E1B4B").fontSize(12).font("Helvetica-Bold").text("Conceptual Questions");
      result.questions.short.forEach((q) => {
        doc.fillColor("#374151").fontSize(10).font("Helvetica").text(`- ${sanitizeForPDF(q)}`, { indent: 15 });
        doc.moveDown(0.25);
      });
    }

    if (result.questions.long?.length) {
      doc.moveDown(0.5);
      doc.fillColor("#1E1B4B").fontSize(12).font("Helvetica-Bold").text("Detailed Analysis Questions");
      result.questions.long.forEach((q) => {
        doc.fillColor("#374151").fontSize(10).font("Helvetica").text(`- ${sanitizeForPDF(q)}`, { indent: 15 });
        doc.moveDown(0.25);
      });
    }

    if (result.questions.diagram) {
      doc.moveDown(0.5);
      doc.fillColor("#DC2626").fontSize(11).font("Helvetica-Bold").text("Visual Task:");
      doc.fillColor("#4B5563").fontSize(10).font("Helvetica-Oblique").text(sanitizeForPDF(result.questions.diagram), { indent: 15 });
    }

    // --- 5. Global Footer injection ---
    // Final check: Calculate range but ensure no page-triggering moves
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.count; i++) {
      doc.switchToPage(i);
      
      const footerY = doc.page.height - 35;
      doc.moveTo(50, footerY - 5).lineTo(545, footerY - 5).strokeColor("#F3F4F6").lineWidth(0.5).stroke();
      
      doc.fontSize(8).fillColor("#9CA3AF").font("Helvetica").text(
        `Generated by ExamPrep AI | Page ${i + 1} of ${range.count}`,
        50,
        footerY,
        { align: "center", lineBreak: false }
      );
    }

    doc.end();
  } catch (error) {
    console.error("PDF Stability Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate stable PDF" });
    }
  }
};
