import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Button, Spinner, Stack, Table
} from 'react-bootstrap';
import dateFormat from 'dateformat';
import { saveAs } from 'file-saver';
import { downloadFile } from '../api';

const createFile = async (dataSet, json = true) => {
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

function Summary({ data }) {
  const dataSet = data;

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

function CalibrationView({array}) {
  // TODO: show plot and array values on hover?
  return (
    <>
      CALIBRATION(
      { array.length }
      )
    </>
  );
}

function SettingValue({ name, value }) {
  if (name.endsWith('_cal')) {
    return (
      <>
        <CalibrationView array={value} />
      </>
    );
  }
  if (typeof value === 'string' || value instanceof String) {
    return (
      <>
        &quot;
        { value }
        &quot;
      </>
    );
  }
  if (Number(value).toString().includes('.')) {
    return (
      <>
        { Number(value).toPrecision(6) }
      </>
    );
  }
  return (
    <>
      {value}
    </>
  );
}

function SettingsView({ title, data }) {
  const entries = Object.entries(data);
  entries.sort((a,b) => a[0].localeCompare(b[0]));

  return (
    <div>
      <h4>{title}</h4>
      <Table striped bordered size="sm">
        <thead>
          <tr>
            <th><strong>Name</strong></th>
            <th><strong>Value</strong></th>
          </tr>
        </thead>
        <tbody>
          { entries.map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td><SettingValue name={key} value={value} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

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
        <div style={{ maxWidth: '800px' }}><Summary data={dataSet} /></div>
        <Stack direction="horizontal" gap={3}>
          <div className="bg-light border" style={{ verticalAlign: 'top' }}>
            <SettingsView title="Settings" data={dataSet.ventilator_settings} />
          </div>
          <div className="bg-light border" style={{ verticalAlign: 'top' }}>
            <SettingsView title="Readings snapshot" data={dataSet.ventilator_readings} />
          </div>
        </Stack>
      </div>
    );
  }

  return (
    <div>
      {loadedDataSet
        ? displayDataSet()
        : <Spinner animation="border" variant="primary" size="xl" />}
    </div>
  );
}

export default DataSet;
