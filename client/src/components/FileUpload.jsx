import { useState } from "react";

export default function FileUpload({ onSubmit, accept, label }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!files.length) return alert("Please select files");

    setLoading(true);
    await onSubmit(files);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <input
        type="file"
        multiple
        accept={accept}
        onChange={(e) => setFiles(e.target.files)}
      />
      <br /><br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : label}
      </button>
    </div>
  );
}
