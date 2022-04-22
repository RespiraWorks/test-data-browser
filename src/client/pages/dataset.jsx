import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
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

  function scenarioInfo() {
    return (
      <div>
        <p>
          {dataSet.scenario.name}
        </p>
      </div>
    );
  }

  return (
    <div>
      {loadedDataSet ? scenarioInfo() : <Spinner animation="border" variant="primary" />}
    </div>
  );
}

export default DataSet;
