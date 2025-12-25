const express = require("express");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.array("files"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const finalPdf = await PDFDocument.create();

    for (const file of req.files) {
      const fileBytes = fs.readFileSync(file.path);

      // ✅ If file is PDF
      if (file.mimetype === "application/pdf") {
        const pdf = await PDFDocument.load(fileBytes);
        const pages = await finalPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => finalPdf.addPage(page));
      }

      // ✅ If file is Image
      else if (file.mimetype.startsWith("image/")) {
        let image;
        if (file.mimetype === "image/png") {
          image = await finalPdf.embedPng(fileBytes);
        } else {
          image = await finalPdf.embedJpg(fileBytes);
        }

        // A4 size in points
const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const MARGIN = 20;

// scale image to fit A4
const scale = Math.min(
  (A4_WIDTH - MARGIN * 2) / image.width,
  (A4_HEIGHT - MARGIN * 2) / image.height
);

const imgWidth = image.width * scale;
const imgHeight = image.height * scale;

// center image
const x = (A4_WIDTH - imgWidth) / 2;
const y = (A4_HEIGHT - imgHeight) / 2;

// create A4 page
const page = finalPdf.addPage([A4_WIDTH, A4_HEIGHT]);

page.drawImage(image, {
  x,
  y,
  width: imgWidth,
  height: imgHeight,
});

      }

      // ❌ Unsupported file
      else {
        fs.unlinkSync(file.path);
        return res.status(400).json({
          error: "Unsupported file type detected",
        });
      }

      // delete temp file
      fs.unlinkSync(file.path);
    }

    const finalBytes = await finalPdf.save();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=merged.pdf",
    });

    res.send(Buffer.from(finalBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to merge PDF and images" });
  }
});

module.exports = router;
