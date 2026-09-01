import { Application } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { createApp } from "../../src/app";
import User from "../../src/models/User";
import Role from "../../src/models/Role";
import { defaultRoles } from "../../src/data/permissions";

let mongo: MongoMemoryServer;

/** Boots an in-memory Mongo and returns the wired app, without listening. */
export const setupTestApp = async (): Promise<Application> => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  // The app's own connect() would dial MONGO_URL; we already have a
  // connection, so hand it a no-op.
  return createApp({ connect: async () => undefined });
};

export const teardownTestApp = async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
};

/** Drops all data between tests without paying to restart the server. */
export const clearDatabase = async () => {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
};

/**
 * Creates a role from the real permission definitions in
 * src/data/permissions.ts, so tests assert against the permissions the
 * seeder actually installs rather than a hand-written fixture.
 */
export const createRole = async (roleName: string) => {
  const definition = defaultRoles.find((role: any) => role.name === roleName);

  if (!definition) {
    throw new Error(
      `No role named "${roleName}" in src/data/permissions.ts. ` +
        `Available: ${defaultRoles.map((r: any) => r.name).join(", ")}`
    );
  }

  return Role.create(definition);
};

export interface TestUserOptions {
  roleName: string;
  department?: string;
  email?: string;
  password?: string;
}

/** Creates a user bound to a real role, returning the plaintext password. */
export const createTestUser = async ({
  roleName,
  department = "general",
  email = `${roleName}@test.local`,
  password = "test-password",
}: TestUserOptions) => {
  const role = await createRole(roleName);
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: `Test ${roleName}`,
    email,
    password: hashed,
    role: role._id,
    department,
    employee_id: `EMP-${roleName}-${Date.now()}`,
  });

  return { user, role, email, password };
};
