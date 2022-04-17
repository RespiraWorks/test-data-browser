import React, { useState } from 'react';
import { uploadFile } from '../api';

const ImportFile = (props) => {
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

  const onFileUpload = () => {
    if (selectedFile === null) {
      return;
    }

    console.log('Uploading!', selectedFile, selectedFilename);
    uploadFile(selectedFile, selectedFilename);
  };

  return (
    <div>
      <h2>Upload a file!!</h2>

      <div>
        {/* Change to application/json */}
        <input type="file" onChange={onFileChange} accept="application/json" />
        <button onClick={onFileUpload}>
          Upload!
        </button>
      </div>
    </div>
  );
};

export default ImportFile;
