const { MongoClient } = require('mongodb');

const url = process.env.LOCAL_DB === 'true'
  ? 'mongodb://mongo-db:27017' : process.env.MONGODB_URL
    || 'mongodb+srv://mgs:KsUYuHidZN9PtGDcC1nV@pizzaiolo.wrvah.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const databaseName = 'sampleData';
const collectionName = 'dataFiles';

let client; let connection;

const connectToDb = (function () {
  client = new MongoClient(url, { useUnifiedTopology: true });
  connection = client.connect();
}());

const testConnectToMongo = () => connection.then(() => {
  const dbo = client.db(databaseName);
  return dbo.collection(collectionName).findOne({}, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
});

const grabSomeData = async () => connection.then(async () => {
  const dbo = client.db(databaseName);
  const retData = [];
  await dbo.collection(collectionName).find().forEach(
    (e) => {
      const e2 = {
        filename: e.filename,
        time: e.start_time_utc,
        tester_name: e.tester_name,
        scenario: e.scenario.name
      };
      retData.push(e2);
    }
  );
  return retData;
});

const getFile = async (filename) => connection.then(async () => {
  const dbo = client.db(databaseName);
  return dbo.collection(collectionName).findOne({ filename });
});

const uploadFile = async (file, filename) => {
  console.log(file.filename);
  return connection.then(async () => {
    const dbo = client.db(databaseName);
    console.log(typeof file);
    return dbo.collection(collectionName).insertOne({
      ...file,
      // if there is a filename set in the file use that as default to whatever the upload name was
      filename: file.filename ?? filename,
    });
  });
};

module.exports = {
  client,
  connection,
  testConnectToMongo,
  grabSomeData,
  getFile,
  uploadFile,
};
