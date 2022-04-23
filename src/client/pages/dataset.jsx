import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Spinner, Table } from 'react-bootstrap';
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
      <Table striped bordered size="sm">
        <tbody>
          <tr>
            <td><strong>Test ID</strong></td>
            <td><strong>{dataSet.unique_id}</strong></td>
          </tr>
          <tr>
            <td>Scenario</td>
            <td>{dataSet.scenario.description}</td>
          </tr>
          <tr>
            <td>Ventilator serial no.</td>
            <td>{dataSet.ventilator_settings['0_ventilator_serial_number']}</td>
          </tr>
          <tr>
            <td>Date & time</td>
            <td>
              { dateFormat(
                new Date(dataSet.start_time_utc.concat('Z')),
                'UTC:yyyy-mm-dd  HH:MM:ss'
              ) }
            </td>
          </tr>
          <tr>
            <td>Git version</td>
            <td>{ dataSet.git_version }</td>
          </tr>
          <tr>
            <td>Download</td>
            <td>
              <Button
                variant="link"
                onClick={() => createFile(true)}
              >
                JSON
              </Button>
            </td>
          </tr>
          <tr>
            <td>Visualization</td>
            <td>
              <Button
                variant="link"
                as="a"
                href={`http://ventmon.coslabs.com/breath_plot?raworks=https://data.respira.works/dbaccess/get-experiment-data?uniqueId=${dataSet.unique_id}`}
              >
                vent-display
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }

  function scenarioInfo() {
    return (
      <div>
        <p />
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
      {loadedDataSet
        ? displayDataSet()
        : <Spinner animation="border" variant="primary" size="xl" />}
    </div>
  );
}

export default DataSet;
