import { startServer } from "./server";

const logger = console;

startServer().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});
