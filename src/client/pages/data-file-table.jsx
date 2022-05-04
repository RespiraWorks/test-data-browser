import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import { Container, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { downloadFile, getTableData } from '../api';

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

  const experimentsTable = experiments.map((experiment, index) => (
    <tr key={index}>
      <td>{ dateFormat(new Date(experiment.time.concat('Z')), 'UTC:yyyy-mm-dd  HH:MM:ss') }</td>
      <td>{ experiment.scenario }</td>
      <td>{ experiment.tester_name }</td>
      <td>
        <Link
          to={{
            pathname: '/dataset',
            search: `?id=${experiment.unique_id}`
          }}
        >
          Open
        </Link>
      </td>
    </tr>
  ));

  function tableWithHeader() {
    return (
      <Table striped bordered size="sm">
        <thead>
          <tr>
            <th><strong>Time (UTC)</strong></th>
            <th><strong>Scenario</strong></th>
            <th><strong>Tester</strong></th>
            <th><strong>Examine dataset</strong></th>
          </tr>
        </thead>

        <tbody>
          {experimentsTable}
        </tbody>

      </Table>
    );
  }

  return (
    <Container>
      {loadedFileNames
        ? tableWithHeader()
        : <Spinner animation="border" variant="primary" size="xl" />}
    </Container>
  );
}

export default DataFileTable;
