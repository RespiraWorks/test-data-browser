import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import { Button, Spinner } from 'react-bootstrap';
import { downloadFile, getTableData } from '../api';
import { Link } from 'react-router-dom';

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
              <i className="fa fa-open" />
              <strong>Open</strong>
            </p>
          </div>
        )
        : null}

      <div className="row border" key={index}>
        <p className="col-3 mt-3">{ dateFormat(new Date(experiment.time.concat('Z')), 'UTC:yyyy-mm-dd  HH:MM:ss') }</p>
        <p className="col-2 mt-3">{ experiment.scenario }</p>
        <p className="col-2 mt-3">{ experiment.tester_name }</p>
        <p className="col-2 my-auto">
          <Link
            to={{
              pathname: '/dataset',
              search: `?id=${experiment.unique_id}`
            }}
          >
            Open
          </Link>
        </p>
      </div>

    </div>
  ));

  return (
    <div style={{ maxWidth: '800px' }}>
      {loadedFileNames ? experimentsTable : <Spinner animation="border" variant="primary" />}
    </div>
  );
}

export default DataFileTable;
