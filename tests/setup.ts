/**
 * Required env must exist before src/config/db is imported anywhere --
 * it throws at module load when these are missing, which is the point.
 */
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
process.env.MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/test";
process.env.NODE_ENV = "test";
