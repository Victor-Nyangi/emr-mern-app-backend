import express, { Application } from "express";
import cors from "cors";
import config from "./config/db";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './graphql';
import User from './models/User';
import jwt from 'jsonwebtoken';
import './models/Role';
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

  // Register non-GraphQL routes first
  app.get("/", (req, res) => {
    res.send("Node.js, Express, and MongoDB API");
  });

  app.get("/api", (req, res) => {
    res.send("EMR Backend API Endpoint");
  });

  // Apollo Server setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start Apollo Server and then start Express app
  server.start().then(() => {
    app.use(
      '/api/v1/graphql',
      (expressMiddleware(server, {
        context: async ({ req }) => {
          // Add user to context if authenticated
          const token = req.headers.authorization?.split(' ')[1];
          if (token) {
            try {
              const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
              const user = await User.findById(decoded.id);
              return { user };
            } catch (e) {
              return {};
            }
          }
          return {};
        },
      }) as unknown as any)
    );

    app.listen(port, () => {
      logger.info(`Server running at http://localhost:${port}`);
    });
  });

  return app;
};
