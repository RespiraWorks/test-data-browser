import axios from 'axios';

const url = window.location.host === 'localhost:3000' ? 'http://localhost:8080' : '';

const getTableData = async () => {
  const route = `${url}/dbaccess/get-test-table-data`;
  return axios({
    method: 'GET',
    url: route,
    crossDomain: true,
  });
};

const downloadFile = async (fileName) => {
  const route = `${url}/dbaccess/download-file?fileName=${fileName}`;
  return axios({
    method: 'GET',
    url: route,
    crossDomain: true,
    data: {
      fileName,
    }
  });
};

const uploadFile = async (file, filename) => {
  const route = `${url}/dbaccess/upload-file`;

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(route, {
    method: 'POST',
    body: formData,
    crossDomain: true,
  }).then((r) => r.json());
  alert(JSON.stringify(res));
};

export {
  getTableData,
  downloadFile,
  uploadFile,
};
