import React, { useState } from 'react';
import { uploadFile } from '../api';

function ImportFile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilename, setSelectedFilename] = useState(null);

  const onFileChange = (event) => {
    if (event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setSelectedFilename(file.name);
    setSelectedFile(file);
  };

  // TODO: check for duplicates
  // TODO: after uploading go to page confirming receipt and/or page for examining/viewing data
  const onFileUpload = () => {
    if (selectedFile === null) {
      return;
    }
    uploadFile(selectedFile);
  };

  return (
    <div>
      <h2>Upload a file!!</h2>
      <div>
        <input type="file" onChange={onFileChange} accept="application/json" />
        <button
          type="button"
          onClick={onFileUpload}
        >
          Upload!
        </button>
      </div>
    </div>
  );
}

export default ImportFile;
