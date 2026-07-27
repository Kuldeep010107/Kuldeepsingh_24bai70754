import "./MediaUploader.css";

export default function MediaUploader({ files, onChange }) {
  const handleFileAdd = (event) => {
    const changeFiles = Array.from(event.target.files || []);
    onChange([...files, ...changeFiles.map((file) => file.name)]);
  };

  const remove = (index) => {
    onChange(files.filter((_, idx) => idx !== index));
  };

  return (
    <div className="media-uploader">
      <label className="field-label">Media</label>
      <input type="file" multiple onChange={handleFileAdd} />
      <div className="media-list">
        {files.map((file, index) => (
          <div key={`${file}-${index}`} className="media-item">
            <span>{file}</span>
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
