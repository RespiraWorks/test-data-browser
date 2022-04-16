var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require("express-fileupload");

require('dotenv').config();

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const mongoRouter = require('./routes/mongo-routes');

const app = express();

const cors = require('cors'); // allow other domains to access this server
app.use(cors());
app.use(fileUpload({
  createParentPath: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/get-mongo-data', mongoRouter);

app.use(express.static(path.join(__dirname, 'client', 'app1', 'build'))); // add the build folder

// all other requests serve client!
app.use("*", express.static(path.join(__dirname, 'client', 'app1', 'build')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// This way you do not need to specify which port to run the command on PORT=8080 npm start can now be npm start (in case you want to start the backend and front-end separate)
// Also makes our code work with Docker (could expose any port, but when you run docker run -p 5000:$port $dockerImage where $port is 8080)
const port = 8080;

app.listen(port, () => console.log(`app listening on http://localhost:${port}`));

module.exports = app;
