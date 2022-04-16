const { MongoClient, ServerApiVersion } = require('mongodb');

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
} = process.env;

const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/myFirstDatabase?retryWrites=true&w=majority`;

const databaseName = 'test-data';
const collectionName = 'experiments';

let client; let connection;

// TODO: follow proper OOP patterns, make this database a persistent object
// TODO: use mongoose instead?
// https://www.digitalocean.com/community/tutorials/containerizing-a-node-js-application-for-development-with-docker-compose
const connectToDb = (function () {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
  });
  connection = client.connect();
}());

const testConnectToMongo = () => connection.then(() => {
  const dbo = client.db(databaseName);
  return dbo.collection(collectionName).findOne({}, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
});

// TODO: make querying more flexible, return various fields
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

const uploadExperiment = async (data, uniqueId) => connection.then(async () => {
  const dbo = client.db(databaseName);
  return dbo.collection(collectionName).insertOne({
    unique_id: uniqueId,
    ...data,
  });
});

module.exports = {
  client,
  connection,
  testConnectToMongo,
  grabMetadata,
  getFullExperimentData,
  uploadExperiment,
};
