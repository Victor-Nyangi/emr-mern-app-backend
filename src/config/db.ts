import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";

dotenv.config();

/**
 * Reads a required environment variable, refusing to start without it.
 *
 * Secrets must never fall back to a default. A missing JWT_SECRET that
 * silently became "" or "secret" would let anyone mint valid tokens for
 * any user, so an absent value has to be a hard startup failure rather
 * than a quietly insecure runtime.
 */
const requireEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Refusing to start. See .env.example for the full list.`
    );
  }

  return value;
};

const uri = requireEnv("MONGO_URL");
const JWT_SECRET = requireEnv("JWT_SECRET");


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
  JWT_SECRET,
  AT_KEY: process.env.AT_KEY || "",
  MONGO_URI: uri,
  CORS_ORIGINS: (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
