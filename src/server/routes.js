const express = require('express');
const path = require('path');
const { DataBase } = require('./database');

const router = express.Router();

router.get('/get-test-table-data', async (req, res) => {
  // DataBase.getInstance().user_model.register({ username: 'candy', active: false }, 'cane');
  // DataBase.getInstance().user_model.register({ username: 'starbuck', active: false }, 'redeye');

  const tableData = await DataBase.getInstance().grabMetadata();
  res.send({
    msg: 'Worked!',
    tableData,
  });
});

router.get('/get-experiment-data', async (req, res) => {
  const { uniqueId } = req.query;
  const dataSet = await DataBase.getInstance().getFullExperimentData(uniqueId);
  // TODO: does this need a failed/succeeded response?
  res.send({
    ...dataSet,
  });
});

router.post('/upload-file', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No files'
      });
    } else {
      const { file } = req.files;
      const filePath = path.parse(file.name);
      if (filePath.ext === '.json') {
        const jsonData = JSON.parse(file.data.toString());
        const upload = await DataBase.getInstance().uploadExperiment(jsonData, filePath.name);
        console.log(`Ingested file: ${file.name}:`, file, upload);
        res.send({
          status: true,
          message: 'Experiment was uploaded to the database'
        });
      } else {
        res.send({
          status: false,
          message: 'Bad file type'
        });
      }
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
