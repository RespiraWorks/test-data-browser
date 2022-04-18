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

const grabMetadata = async () => connection.then(async () => {
  const dbo = client.db(databaseName);
  const retData = [];
  await dbo.collection(collectionName).find().forEach(
    (e) => {
      const e2 = {
        unique_id: e.unique_id,
        time: e.start_time_utc,
        tester_name: e.tester_name,
        scenario: e.scenario.name
      };
      retData.push(e2);
    }
  );
  return retData;
});

const getFullExperimentData = async (uniqueId) => connection.then(async () => {
  const dbo = client.db(databaseName);
  const query = { unique_id: uniqueId };
  return dbo.collection(collectionName).findOne(query);
});

const uploadExperiment = async (data, uniqueId) => {
  return connection.then(async () => {
    const dbo = client.db(databaseName);
    return dbo.collection(collectionName).insertOne({
      unique_id: uniqueId,
      ...data,
    });
  });
};

module.exports = {
  client,
  connection,
  testConnectToMongo,
  grabMetadata,
  getFullExperimentData,
  uploadExperiment,
};
