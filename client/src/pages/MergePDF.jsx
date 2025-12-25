import { api } from "../api";
import FileUpload from "../components/FileUpload";

export default function MergePDF() {
  const merge = async (files) => {
    const formData = new FormData();
    for (let file of files) formData.append("pdfs", file);

    const res = await api.post("/merge-pdf", formData, {
      responseType: "blob",
    });

    download(res.data, "merged.pdf");
  };

  return (
    <FileUpload
      accept="application/pdf"
      label="Merge PDFs"
      onSubmit={merge}
    />
  );
}

function download(data, filename) {
  const url = window.URL.createObjectURL(new Blob([data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
