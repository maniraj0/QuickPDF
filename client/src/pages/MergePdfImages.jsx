import { api } from "../api";
import FileUpload from "../components/FileUpload";

export default function MergePdfImages() {
  const merge = async (files) => {
    const formData = new FormData();
    for (let file of files) formData.append("files", file);

    const res = await api.post("/merge-pdf-images", formData, {
      responseType: "blob",
    });

    download(res.data, "merged.pdf");
  };

  return (
    <FileUpload
      accept=".pdf,image/*"
      label="Merge PDF & Images"
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
