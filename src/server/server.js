require('dotenv').config();
const express = require('express'); // server software
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');
// const session = require('express-session'); // session middleware
const passport = require('passport'); // authentication
const { DataBase } = require('./database');
const { ConfigureJwtStrategy } = require('./strategies/JwtStrategy');
const { ConfigureLocalStrategy } = require('./strategies/LocalStrategy');
require('./authenticate');

const app = express();

app.use(logger('dev'));

console.log(`node env = ${process.env.NODE_ENV}`);
const dev = process.env.NODE_ENV !== 'production';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (dev) {
  app.use(cookieParser());
} else {
  app.use(cookieParser(process.env.COOKIE_SECRET));
}

// Add the client URL to the CORS policy
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(',')
  : [];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
if (dev) {
  app.use(cors());
} else {
  app.use(cors(corsOptions));
}

app.use(fileUpload({
  createParentPath: true
}));

app.use(express.static(path.resolve('dist')));

const dataRouter = require('./routes/dbRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/dbaccess', dataRouter);
app.use('/users', userRouter);

// TODO: proper error handlers

app.get('*', (req, res) => res.sendFile(path.resolve('dist/index.html')));

const port = process.env.PORT || 8080;

async function startServer() {
  const singleton = DataBase.getInstance();
  await singleton.connect();

  ConfigureJwtStrategy();
  ConfigureLocalStrategy();

  // Configure More Middleware
  app.use(passport.initialize());
  // app.use(passport.session());

  app.listen(port, () => console.log(`Listening on port ${port}`));
}

startServer().then(() => { console.log('Server is running.'); });
