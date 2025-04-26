import express, { Application } from "express";
import cors from "cors";
import config from "./config/db";
const logger = console;

export const createApp = () => {
  const app: Application = express();
  const { port, dbConnection } = config;

  app.use(express.json());

  // Connect to MongoDB **before starting the server**
  dbConnection();

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  app.use(cors({ origin: true, credentials: true }));

  app.get("/", (req, res) => {
    res.send("Node.js, Express, and MongoDB API");
  });

  app.get("/api", (req, res) => {
    res.send("EMR Backend API Endpoint");
  });

  app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
  });

  return app;
};
