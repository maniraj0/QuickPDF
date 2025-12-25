const express = require("express");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.array("pdfs"), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({
        error: "Please upload at least two PDF files",
      });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);

      const copiedPages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      );

      copiedPages.forEach((page) => mergedPdf.addPage(page));

      // delete temp file
      fs.unlinkSync(file.path);
    }

    const mergedPdfBytes = await mergedPdf.save();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=merged.pdf",
    });

    res.send(Buffer.from(mergedPdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to merge PDFs" });
  }
});

module.exports = router;
