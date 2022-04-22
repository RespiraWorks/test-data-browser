import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import { Spinner } from 'react-bootstrap';
import { downloadFile, getTableData } from '../api';
import './data-file-table.css';

function DataFileTable() {
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

  // TODO: move this function and buttons to separate page dedicated to examining specific dataset
  const createFile = async (uniqueId, json = true) => {
    const resp = await downloadFile(uniqueId);

    const dataSet = resp?.data;
    // eslint-disable-next-line no-underscore-dangle
    delete dataSet._id;

    const downloadName = uniqueId + (json ? '.json' : '.csv');
    let fileToSave = null;

    if (json) {
      fileToSave = new Blob([JSON.stringify(dataSet, null, 4)], {
        type: 'application/json'
      });
    } else {
      // TODO: implement conversion of traces into table
      const csv = null;
      fileToSave = new Blob([csv], {
        type: 'text/csv'
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
        <p className="col-2 my-auto">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => createFile(experiment.unique_id, true)}
          >
            JSON
          </button>
        </p>
        <p className="col-2 my-auto">
          <a href={`http://ventmon.coslabs.com/breath_plot?raworks=https://data.respira.works/dbaccess/get-experiment-data?uniqueId=${experiment.unique_id}`}>
            VentMon
          </a>
        </p>
      </div>

    </div>
  ));

  return (
    <div className="container max-width-1000 mb-4">
      {loadedFileNames ? experimentsTable : <Spinner animation="border" variant="primary" />}
    </div>
  );
}

export default DataFileTable;
