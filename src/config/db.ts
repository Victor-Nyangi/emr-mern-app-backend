import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.MONGO_URL || "";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      // Optional: Avoid warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    console.log("✅ MongoDB Connected...");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error occurred with message", err.message);
    } else {
      console.error("❌ MongoDB Connection Failed:", err);
    }
    process.exit(1);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};


export default {
  port: process.env.PORT || 5000,
  dbConnection: connectDB,
  client: client,
  JWT_SECRET: process.env.JWT_SECRET || "",
  AT_KEY: process.env.AT_KEY || ""
};
