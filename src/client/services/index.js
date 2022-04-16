import axios from 'axios';

const url = window.location.host === "localhost:3000" ? "http://localhost:8080" : "";

const getFileNames = async () => {
	const route = url + "/get-mongo-data/file-names";
	return await axios({
        method: "GET", 
        url: route,
        crossDomain: true,
    });
}

const downloadFile = async (fileName) => {
    const route = `${url}/get-mongo-data/download-file?fileName=${fileName}`;
    return await axios({
        method: "GET", 
        url: route,
        crossDomain: true,
        data: {
            fileName,
        }
    });
}

const uploadFile = async (file, filename) => {

    const route = `${url}/get-mongo-data/upload-file`;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(route, {
      method: "POST",
      body: formData,
      crossDomain: true,
    }).then(res => res.json())
    alert(JSON.stringify(res))
}

export { 
    getFileNames,
    downloadFile,
    uploadFile,
};