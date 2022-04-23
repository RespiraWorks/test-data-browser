import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom'
import { Button, Spinner } from 'react-bootstrap';
import dateFormat from 'dateformat';
import { saveAs } from 'file-saver';
import { downloadFile } from '../api';

function DataSet() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadedDataSet, setLoadedDataSet] = useState(false);
  const [dataSet, setDataSet] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const uniqueId = searchParams.get('id');
      const resp = await downloadFile(uniqueId);
      setLoadedDataSet(true);
      setDataSet(resp?.data);
    };
    fetchData();
  }, []);

  const createFile = async (json = true) => {
    const downloadName = dataSet.unique_id + (json ? '.json' : '.csv');

    let fileToSave = null;

    const dataSetCopy = dataSet;
    // eslint-disable-next-line no-underscore-dangle
    delete dataSetCopy._id;

    if (json) {
      fileToSave = new Blob([JSON.stringify(dataSetCopy, null, 2)], {
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

  function summary() {
    return (
      <div className="">
        <div className="row border">
          <p className="col-2 my-auto">
            <strong>Test ID</strong>
          </p>
          <p className="col-5 my-auto">
            <strong>{dataSet.unique_id}</strong>
          </p>
        </div>
        <div className="row border">
          <p className="col-2 my-auto">
            Scenario
          </p>
          <p className="col-5 my-auto">
            {dataSet.scenario.description}
          </p>
        </div>
        <div className="row border">
          <p className="col-2 my-auto">
            Machine serial No.
          </p>
          <p className="col-5 my-auto">
            {dataSet.ventilator_settings['0_ventilator_serial_number']}
          </p>
        </div>
        <div className="row border">
          <p className="col-2 my-auto">
            Data & time
          </p>
          <p className="col-5 my-auto">
            { dateFormat(new Date(dataSet.start_time_utc.concat('Z')), 'UTC:yyyy-mm-dd  HH:MM:ss') }
          </p>
        </div>
        <div className="row border">
          <p className="col-2 my-auto">
            Git version
          </p>
          <p className="col-5 my-auto">
            { dataSet.git_version }
          </p>
        </div>
        <div className="row border">
          <p className="col-2 my-auto">
            Download as JSON
          </p>
          <p className="col-5 my-auto">
            <Button variant="dark" onClick={() => createFile(true)}>
              Download as JSON
            </Button>
          </p>
        </div>
        <div className="row border">
          <p className="col-2 my-auto">
            Visualization
          </p>
          <p className="col-5 my-auto">
            <Button
              variant="link"
              as="a"
              href={`http://ventmon.coslabs.com/breath_plot?raworks=https://data.respira.works/dbaccess/get-experiment-data?uniqueId=${dataSet.unique_id}` }
            >
              vent-display
            </Button>
          </p>
        </div>
      </div>
    );
  }

  function scenarioInfo() {
    return (
      <div>
        <p>
        </p>
      </div>
    );
  }

  function displayDataSet() {
    return (
      <div>
        <center>{summary()}</center>
        <center>{scenarioInfo()}</center>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <center>{loadedDataSet ? displayDataSet() : <Spinner animation="border" variant="primary" />}</center>
    </div>
  );
}

export default DataSet;
