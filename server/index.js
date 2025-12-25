console.log("INDEX FILE LOADED");

const express = require("express");
const cors = require("cors");

// ✅ CREATE app FIRST
const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ IMPORT ROUTES AFTER app
const mergePdfRoute = require("./routes/mergePdf");
app.use("/api/merge-pdf", mergePdfRoute);

const mergePdfImagesRoute = require("./routes/mergePdfImages");
app.use("/api/merge-pdf-images", mergePdfImagesRoute);


const imageToPdfRoute = require("./routes/imageToPdf");

// ✅ USE ROUTES
app.use("/api/image-to-pdf", imageToPdfRoute);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("QuickPDF backend running 🚀");
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
