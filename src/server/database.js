const { ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const schemata = require('./user');

// See README for what to put in your `.env` file
const {
  MONGO_URI
} = process.env;

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
      dbName: null,
      autoIndex: false, // Don't build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };
    this.experiments_conn = null;
    this.experiments = null;
    this.user_model = null;
  }

  async connect() {
    try {
      this.mongoose_options.dbName = 'test-data';
      this.experiments_conn = await mongoose.createConnection(
        MONGO_URI,
        this.mongoose_options
      ).asPromise();
    } catch (error) {
      console.log(`Failed to connect to database: ${error}`);
    }
    mongoose.connection.on('error', (error) => {
      console.log(`Database error: ${error}`);
    });
    this.experiments = this.experiments_conn.db.collection('experiments');
    this.user_model = this.experiments_conn.model('userData', schemata.User, 'userData');
    console.log(`connection: ${this.experiments_conn}`);
    console.log(`col: ${this.experiments}`);
  }

  static getInstance() {
    if (!instance) {
      instance = new DataBase();
    }

    return instance;
  }

  async testConnectToMongo() {
    return this.experiments.findOne({}, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
  }

  // TODO: make querying more flexible, return various fields
  async grabMetadata() {
    const retData = [];
    await this.experiments.find().forEach(
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
    return this.experiments.findOne(query);
  }

  async uploadExperiment(data, uniqueId) {
    return this.experiments.insertOne({
      unique_id: uniqueId,
      ...data,
    });
  }
}

module.exports = {
  DataBase
};
