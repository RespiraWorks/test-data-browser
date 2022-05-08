const { MongoClient, ServerApiVersion } = require('mongodb');

// See README for what to put in your `.env` file
const {
  MONGO_URI
} = process.env;

const databaseName = 'test-data';
const collectionName = 'experiments';

let instance = null;

// TODO: use mongoose instead?
// https://www.digitalocean.com/community/tutorials/containerizing-a-node-js-application-for-development-with-docker-compose
class DataBase {
  constructor() {
    this.properties = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1
    };
    this.client = null;
    this.experiments_db = null;
  }

  connect() {
    this.client = new MongoClient(MONGO_URI, this.properties);
    this.client.connect();
    this.experiments_db = this.client.db(databaseName);
  }

  static getInstance() {
    if (!instance) {
      instance = new DataBase();
      instance.connect();
    }

    return instance;
  }

  async testConnectToMongo() {
    return this.experiments_db.collection(collectionName).findOne({}, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
  }

  // TODO: make querying more flexible, return various fields
  async grabMetadata() {
    const retData = [];
    await this.experiments_db.collection(collectionName).find().forEach(
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
  }

  async getFullExperimentData(uniqueId) {
    const query = { unique_id: uniqueId };
    return this.experiments_db.collection(collectionName).findOne(query);
  }

  async uploadExperiment(data, uniqueId) {
    return this.experiments_db.collection(collectionName).insertOne({
      unique_id: uniqueId,
      ...data,
    });
  }
}

module.exports = {
  DataBase
};
