import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { globalLimiter } from "./middleware/rateLimiters";
import config from "./config/db";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./graphql";
import User from "./models/User";
import jwt from "jsonwebtoken";
import { registerRoutes } from "./routes";
import "./models/Role";

export interface CreateAppOptions {
  /**
   * Connects the database. Injectable so tests can point at an in-memory
   * instance instead of MONGO_URL. Pass a no-op when the caller has
   * already established its own connection.
   */
  connect?: () => unknown | Promise<unknown>;
}

/**
 * Builds the fully-wired Express application.
 *
 * Deliberately does not listen -- see startServer in server.ts. Keeping
 * the two apart is what lets supertest exercise the real app, including
 * the authorization middleware, without binding a port.
 */
export const createApp = async (
  options: CreateAppOptions = {}
): Promise<Application> => {
  const app: Application = express();
  const { dbConnection, CORS_ORIGINS } = config;
  const connect = options.connect ?? dbConnection;

  app.use(helmet());
  app.use(globalLimiter);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Allowlist rather than reflecting the request's Origin back. With
  // credentials enabled, `origin: true` echoes any caller's origin and
  // hands them a valid CORS grant against an authenticated API.
  app.use(
    cors({
      origin: (origin, callback) => {
        // Same-origin and non-browser callers (curl, server-to-server)
        // send no Origin header at all.
        if (!origin || CORS_ORIGINS.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`Origin not allowed by CORS: ${origin}`));
      },
      credentials: true,
    })
  );

  await connect();

  app.get("/", (req, res) => {
    res.send("Node.js, Express, and MongoDB API");
  });

  app.get("/api", (req, res) => {
    res.send("EMR Backend API Endpoint");
  });

  // Apollo must finish starting before its middleware is mounted, and
  // that must happen before the REST routers so ordering is deterministic.
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(
    "/api/v1/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Add user to context if authenticated
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
          try {
            const decoded: any = jwt.verify(token, config.JWT_SECRET);
            const user = await User.findById(decoded.id);
            return { user };
          } catch (e) {
            return {};
          }
        }
        return {};
      },
    }) as unknown as any
  );

  registerRoutes(app);

  return app;
};

export default createApp;
