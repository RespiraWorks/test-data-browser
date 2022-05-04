import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Button, Col, Container, Row, Spinner, Stack, Table,
} from 'react-bootstrap'
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

function Heading({text, level}) {
  if (level === 6) {
    return (
      <h6>{ text }</h6>
    );
  }
  if (level === 5) {
    return (
      <h5>{ text }</h5>
    );
  }
  if (level === 4) {
    return (
      <h4>{ text }</h4>
    );
  }
  if (level === 3) {
    return (
      <h3>{ text }</h3>
    );
  }
  if (level === 2) {
    return (
      <h2>{ text }</h2>
    );
  }
  if (level === 1) {
    return (
      <h1>{ text }</h1>
    );
  }
  return (
    <>
      { text }
    </>
  );
}

function SettingsView({ title, data, heading_level = 4 }) {
  const entries = Object.entries(data);
  entries.sort((a, b) => a[0].localeCompare(b[0]));
  return (
    <div>
      <Heading text={title} level={heading_level} />
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

function TraceVarsList({array}) {
  return (
    <div>
      <Stack direction="horizontal" gap={3}>
        { array.map(name => (
          <div className="bg-light border">{name}</div>
        ))}
      </Stack>
    </div>
  );
}

function ScenarioInfo({ scenario }) {
  return (
    <div>
      <h4>Test Scenario</h4>
      <Container>
        <Row>
          <Col sm={3}><strong>Name</strong></Col>
          <Col sm><strong>{scenario.name}</strong></Col>
        </Row>
        <Row>
          <Col sm={3}><strong>Description</strong></Col>
          <Col sm><strong>{scenario.description}</strong></Col>
        </Row>
        <Row>
          <Col sm={5}>Pre-capture ignore period</Col>
          <Col sm>{scenario.capture_ignore_secs} secs</Col>
        </Row>
        <Row>
          <Col sm={5}>Capture duration</Col>
          <Col sm>{scenario.capture_duration_secs} secs</Col>
        </Row>
        <Row>
          <Col sm={5}>Trace period</Col>
          <Col sm>{scenario.trace_period} loop cycles</Col>
        </Row>
        <Row>
          <Col sm={3}>Trace values</Col>
          <Col sm><TraceVarsList array={scenario.trace_variable_names} /></Col>
        </Row>
        <Row><br/></Row>
        <Row>
          <Col sm>
            <SettingsView
              title="Vent settings"
              data={scenario.ventilator_settings}
              heading_level={5}
            />
          </Col>
          <Col sm>
            <Row>
              <SettingsView
                title="Manual settings"
                data={scenario.manual_settings}
                heading_level={5}
              />
              <SettingsView
                title="Test Criteria"
                data={scenario.test_criteria}
                heading_level={5}
              />
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function TraceInfo({trace}) {
  const count = trace.data.length;
  const minimum = Math.min.apply(null, trace.data).toPrecision(6);
  const maximum = Math.max.apply(null, trace.data).toPrecision(6);
  return (
      <tr>
        <th>{trace.variable_name}</th>
        <th>{count}</th>
        <th>{minimum}</th>
        <th>{maximum}</th>
        <th>{trace.variable_units}</th>
      </tr>
  );
}

function TracesInfo({traces}) {
  return (
    <div>
      <h4>Traces</h4>
      <Table striped bordered size="sm">
        <thead>
          <tr>
            <th><strong>Variable</strong></th>
            <th><strong>Elements</strong></th>
            <th><strong>Minimum</strong></th>
            <th><strong>Maximum</strong></th>
            <th><strong>Units</strong></th>
          </tr>
        </thead>
        <tbody>
          { traces.map(value => (
            <TraceInfo trace={value} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function Summary({ data }) {
  const dataSet = data;

  return (
    <div>
      <h4>Summary</h4>
      <Table striped bordered size="sm">
        <tbody>
          <tr>
            <td><strong>Test ID</strong></td>
            <td><strong>{dataSet.unique_id}</strong></td>
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

  function displayDataSet() {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <Row><Summary data={dataSet} /></Row>
              <Row><TracesInfo traces={dataSet.traces} /></Row>
            </Col>
            <Col><ScenarioInfo scenario={dataSet.scenario} /></Col>
          </Row>
          <Row>
            <Col><SettingsView title="Settings snapshot" data={dataSet.ventilator_settings} /></Col>
            <Col><SettingsView title="Readings snapshot" data={dataSet.ventilator_readings} /></Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    // style={{ maxWidth: '1000px' }}
    <div>
      {loadedDataSet
        ? displayDataSet()
        : <Spinner animation="border" variant="primary" size="xl" />}
    </div>
  );
}

export default DataSet;
