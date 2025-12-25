import { useState } from "react";
import ImageToPDF from "./pages/ImageToPDF";
import MergePDF from "./pages/MergePDF";
import MergePdfImages from "./pages/MergePdfImages";

export default function App() {
  const [page, setPage] = useState("image");

  return (
    <div>
      <nav style={{ padding: 10 }}>
        <button onClick={() => setPage("image")}>Image ➜ PDF</button>
        <button onClick={() => setPage("merge")}>Merge PDFs</button>
        <button onClick={() => setPage("mix")}>PDF + Images</button>
      </nav>

      {page === "image" && <ImageToPDF />}
      {page === "merge" && <MergePDF />}
      {page === "mix" && <MergePdfImages />}
    </div>
  );
}
