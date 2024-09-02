const { MongoClient, ServerApiVersion } = require('mongodb');

const config = require('config');
const mongoURL = config.get('mongoURL');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoURL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectDB = async () => {
  try {
    await client.connect();

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    console.log('MongoDB is Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};


module.exports = connectDB;