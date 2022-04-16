const express = require('express');
const router = express.Router();
const mongoConnection = require('../mongoDB/index.js');
// let multer  = require('multer')
// let upload = multer({ dest: 'uploads/' })
const fs = require('fs');
const path = require('path');

// test-route/test-route
router.get('/file-names', async (req, res) => {
  const fileNames = await mongoConnection.grabAllFileNames();

  res.send({
    msg : "Worked!",
    fileNames: fileNames,
  });
});

router.get('/download-file', async (req, res) => {
  const { fileName } = req.query;
  const file = await mongoConnection.getFile(fileName);

  res.send({
    msg : "Worked!",
    file,
  });
});

router.get('/get-file', async (req, res) => {
  const { fileName } = req.query;
  const file = await mongoConnection.getFile(fileName);

  res.send({
    ...file,
  });
});

router.post('/upload-file', async (req, res) => {
  try {
    if(!req.files){
      res.send({
        status: false,
        message: "No files"
      })
    } else {
      const { file } = req.files;

      if (file.name.split(".")[1] === "json") {

        const stringOfData = file.data.toString('utf8'); // convert our buffer into a readable string
        const jsonData = JSON.parse(stringOfData); // convert our string into JSON
        const upload = await mongoConnection.uploadFile(jsonData, file.name);
        console.log(upload);

        res.send({
          status: true,
          message: "JSON is uploaded to the database"
        });
      } else {
        file.mv("./images/" + file.name);

        res.send({
          status: true,
          message: "Image is uploaded to server"
        });
      }
    }
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router;