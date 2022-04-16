const MongoClient = require('mongodb').MongoClient;

const url =  process.env.LOCAL_DB === 'true' ? 'mongodb://mongo-db:27017' : process.env.MONGODB_URL || 'mongodb+srv://respiraWorks:S5u7t5yOmomK0x9j@cluster0.7yqbv.mongodb.net/sampleData?retryWrites=true&w=majority';
const databaseName = "sampleData";
const collectionName = "dataFiles";

let client, connection;

const connectToDb = (function() {  
  client = new MongoClient(url, { useUnifiedTopology: true });
  connection = client.connect();
}())

const testConnectToMongo = () => {  
  return connection.then(() => {
    const dbo = client.db(databaseName);
    return dbo.collection(collectionName).findOne({}, function(err, result) {
      if (err) throw err;
      console.log(result);
    });
  })
}

const grabAllFileNames = async () => {  
  return connection.then(async () => {
    const dbo = client.db(databaseName);
    const fileNameArr = [];
    await dbo.collection(collectionName).find({newerFormat: true}).forEach(
      (e) => {
      	fileNameArr.push(e.filename);
  	});

  	return fileNameArr;
  });
}

const getFile = async (filename) => {  
  return connection.then(async () => {
    const dbo = client.db(databaseName);
    return await dbo.collection(collectionName).findOne({filename});
  });
}

const uploadFile = async (file, filename) => {
  console.log(file.filename);
  return connection.then(async () => {
    const dbo = client.db(databaseName);
    console.log(typeof file);
    return await dbo.collection(collectionName).insertOne({
      ...file,
      newerFormat: true,
      filename: file.filename ?? filename, // if there is a filename set in the file use that as default to whatever the upload name was
    });
  }); 
}

module.exports = {
	client,
	connection,
	testConnectToMongo,
	grabAllFileNames,
  getFile,
  uploadFile,
};