
import { api } from "../api";
import FileUpload from "../components/FileUpload";

export default function ImageToPDF() {
  const convert = async (files) => {
    const formData = new FormData();
    for (let file of files) formData.append("images", file);

    const res = await api.post("/image-to-pdf", formData, {
      responseType: "blob",
    });

    download(res.data, "images.pdf");
  };

  return (
    <FileUpload
      accept="image/*"
      label="Convert to PDF"
      onSubmit={convert}
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
