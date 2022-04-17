import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import { getFileNames, downloadFile } from '../api';
import './data-file-table.css';

function DataFileTable(props) {
  const [loadedFileNames, setLoadedFileNames] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const files = await getFileNames();
      setLoadedFileNames(true);
      setFiles(files?.data?.fileNames);
    };
    fetchData();
  }, []);

  const createFile = async (fileName, json = true) => {
    const resp = await downloadFile(fileName);
    const { file } = resp?.data;

    const downloadName = fileName.split('.')[0] + (json ? '.json' : '.csv');
    let fileToSave = null;

    if (json) {
      // Create a blob of the data
      fileToSave = new Blob([JSON.stringify(file)], {
        type: 'application/json',
        name: downloadName
      });
    } else {
      // code taken from: https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
      const json2 = file?.data;
      const fields = Object.keys(json2[0]);
      const replacer = function (key, value) { return value === null ? '' : value; };
      let csv = json2.map((row) => fields.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(fields.join(',')); // add header column
      csv = csv.join('\r\n');

      fileToSave = new Blob([csv], {
        type: 'text/csv',
        name: downloadName
      });
    }

    // Save the file
    saveAs(fileToSave, downloadName);
  };

  const createAllFiles = () => {
    files.forEach((file) => createFile(file, false));
  };

  const filesTable = files.map((file, index) => (
    <div className="" key={index}>
      { index === 0
        ? (
          <div className="row border mt-4">
            <p className="col-2 mt-3"><strong>Index:</strong></p>
            <p className="col-4 my-auto">
              <i className="fa fa-file" />
              <strong> Filename:</strong>
            </p>
            <p className="col-4 my-auto">
              <i className="fa fa-download" />
              <strong> Download:</strong>
            </p>
            <p className="col-2 my-auto">
              <i className="fa fa-external-link" />
              <strong> URL:</strong>
            </p>
          </div>
        )
        : null}

      <div className="row border" key={index}>
        <p className="col-2 mt-3">{ index + 1 }</p>
        <p className="col-4 mt-3 text-break">{ file }</p>
        <div className="col-2 my-auto mx-auto">
          <button
            className="btn btn-primary"
            onClick={() => createFile(file, true)}
          >
            JSON
          </button>
        </div>

        <div className="col-2 my-auto mx-auto">
          <button
            className="btn btn-secondary"
            onClick={() => createFile(file, false)}
          >
            CSV
          </button>
        </div>

        <p className="col-2 my-auto"><a href={`http://ventmon.coslabs.com/breath_plot?raworks=https://respiraworks-download-data.herokuapp.com/get-mongo-data/get-file?fileName=${file}`}>Link</a></p>
      </div>

      { index + 1 === files.length
        ? (
          <div className="row border">
            <p className="col-2 mt-3">{ index + 2}</p>
            <p className="col-4 my-auto"><strong>All Files</strong></p>
            <button
              className="btn btn-success col-4 my-auto download-button mx-auto"
              onClick={() => createAllFiles()}
            >
              DOWNLOAD ALL (CSV)
            </button>

            <p className="col-2" />
          </div>
        )
        : null}
    </div>
  ));

  return (
    <div>
      <div className="container max-width-600 mb-4">
        <h2 className="mt-4">Downloadable Test Data:</h2>
        {loadedFileNames ? filesTable : <center><i className="fa fa-spinner fa-spin fa-5x mt-5" /></center>}
      </div>
    </div>
  );
}

export default DataFileTable;
