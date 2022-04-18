import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import {downloadFile, getTableData} from '../api';
import './data-file-table.css';
import dateFormat from 'dateformat';

function DataFileTable(props) {
  const [loadedFileNames, setLoadedFileNames] = useState(false);
  const [experiments, setExperiments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const experiments = await getTableData();
      setLoadedFileNames(true);
      setExperiments(experiments?.data?.tableData);
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

  const experimentsTable = experiments.map((experiment, index) => (
    <div className="" key={index}>
      { index === 0
        ? (
          <div className="row border mt-5">
            <p className="col-3 mt-3">
              <strong>Time (UTC)</strong>
            </p>
            <p className="col-2 my-auto">
              <i className="fa mt-3" />
              <strong>Scenario</strong>
            </p>
            <p className="col-2 my-auto">
              <i className="fa mt-3" />
              <strong>Tester</strong>
            </p>
            <p className="col-2 my-auto">
              <i className="fa fa-download" />
              <strong>Download</strong>
            </p>
            <p className="col-2 my-auto">
              <i className="fa fa-external-link" />
              <strong> Visualization</strong>
            </p>
          </div>
        )
        : null}

      <div className="row border" key={index}>
        <p className="col-3 mt-3">{ dateFormat(new Date(experiment.time.concat('Z')), 'UTC:yyyy-mm-dd  HH:MM:ss') }</p>
        <p className="col-2 mt-3">{ experiment.scenario }</p>
        <p className="col-2 mt-3">{ experiment.tester_name }</p>
        <div className="col-1 my-auto mx-auto">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => createFile(experiment.filename, true)}
          >
            JSON
          </button>
        </div>

        <div className="col-1 my-auto mx-auto">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => createFile(experiment.filename, false)}
          >
            CSV
          </button>
        </div>

        <p className="col-2 my-auto">
          <a href={`http://ventmon.coslabs.com/breath_plot?raworks=https://respiraworks-download-data.herokuapp.com/dbaccess/get-file?fileName=${experiment.filename}`}>
            VentMon
          </a>
        </p>
      </div>

    </div>
  ));

  return (
    <div>
      <div className="container max-width-1200 mb-4">
        <h2 className="mt-4">Downloadable Test Data:</h2>
        {loadedFileNames ? experimentsTable : <center><i className="fa fa-spinner fa-spin fa-5x mt-5" /></center>}
      </div>
    </div>
  );
}

export default DataFileTable;
