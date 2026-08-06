import { createApp } from "./app";
import config from "./config/db";

const logger = console;

/** Builds the app and binds it to a port. */
export const startServer = async () => {
  const { port } = config;
  const app = await createApp();

  return app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
  });
};

export default startServer;
