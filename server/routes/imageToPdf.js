const express = require("express");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.array("images"), async (req, res) => {
  try {
    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      const imgBytes = fs.readFileSync(file.path);

      let image;
      if (file.mimetype === "image/png") {
        image = await pdfDoc.embedPng(imgBytes);
      } else {
        image = await pdfDoc.embedJpg(imgBytes);
      }

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0 });
      fs.unlinkSync(file.path);
    }

    const pdfBytes = await pdfDoc.save();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=images.pdf",
    });

    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    res.status(500).json({ error: "Failed to convert images to PDF" });
  }
});

module.exports = router;
