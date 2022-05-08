const { ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

// See README for what to put in your `.env` file
const {
  MONGO_URI
} = process.env;

const databaseName = 'test-data';
const collectionName = 'experiments';

let instance = null;

// https://www.digitalocean.com/community/tutorials/containerizing-a-node-js-application-for-development-with-docker-compose
class DataBase {
  constructor() {
    this.mongoose_options = {
      /* MongoDB options */
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
      /* mongoose options */
      dbName: databaseName,
      autoIndex: false, // Don't build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };
    // this.client = null;
    this.experiments_db = null;
  }

  async connect() {
    try {
      await mongoose.connect(MONGO_URI, this.mongoose_options);
    } catch (error) {
      console.log(`Failed to connect to database: ${error}`);
    }
    mongoose.connection.on('error', (err) => {
      console.log(`Database error: ${err}`);
    });
    this.experiments_db = mongoose.connection.db;
  }

  static getInstance() {
    if (!instance) {
      instance = new DataBase();
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
