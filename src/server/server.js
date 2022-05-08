require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { DataBase } = require('./database');

const port = process.env.PORT || 8080;

const app = express();

// allow other domains to access this server
app.use(cors());
app.use(fileUpload({
  createParentPath: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve('dist')));

const mongoRouter = require('./routes');

app.use('/dbaccess', mongoRouter);

// TODO: proper error handlers

app.get('*', (req, res) => res.sendFile(path.resolve('dist/index.html')));

async function startServer() {
  const singleton = DataBase.getInstance();
  await singleton.connect();
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

startServer().then(() => { console.log('Server is running.'); });
