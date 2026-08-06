import dotenv from "dotenv";
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

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri);

    console.log("✅ MongoDB Connected...");
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ MongoDB Connection Failed:", err.message);
    } else {
      console.error("❌ MongoDB Connection Failed:", err);
    }
    process.exit(1);
  }
};


export default {
  port: process.env.PORT || 5000,
  dbConnection: connectDB,
  JWT_SECRET,
  AT_KEY: process.env.AT_KEY || "",
  MONGO_URI: uri,
  CORS_ORIGINS: (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
