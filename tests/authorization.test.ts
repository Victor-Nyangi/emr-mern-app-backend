import request from "supertest";
import { Application } from "express";
import jwt from "jsonwebtoken";

import {
  setupTestApp,
  teardownTestApp,
  clearDatabase,
  createTestUser,
} from "./helpers/testApp";
import config from "../src/config/db";
import AuthorizationService from "../src/services/authorizationService";
import User from "../src/models/User";

let app: Application;

const loginAs = async (roleName: string, department = "general") => {
  const { email, password, user, role } = await createTestUser({
    roleName,
    department,
  });

  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password });

  return { token: response.body.token as string, user, role };
};

beforeAll(async () => {
  app = await setupTestApp();
});

afterAll(async () => {
  await teardownTestApp();
});

afterEach(async () => {
  jest.restoreAllMocks();
  await clearDatabase();
});

describe("authorization failures are distinguishable", () => {
  it("returns 401, not 403, when no token is supplied", async () => {
    const response = await request(app).get("/api/v1/patients");

    expect(response.status).toBe(401);
  });

  it("returns 401, not 403, when the token belongs to a deleted user", async () => {
    const { token, user } = await loginAs("doctor");

    // Valid signature, but the account is gone.
    await User.findByIdAndDelete(user._id);

    const response = await request(app)
      .get("/api/v1/patients")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
  });

  it("returns 403 when the caller is authenticated but lacks permission", async () => {
    const { token } = await loginAs("receptionist");

    // Receptionists have no delete on patient in src/data/permissions.ts.
    const response = await request(app)
      .delete("/api/v1/patients/000000000000000000000000")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("surfaces an internal failure as 5xx rather than disguising it as 403", async () => {
    const { token } = await loginAs("doctor");

    jest
      .spyOn(AuthorizationService, "checkPermission")
      .mockRejectedValue(new Error("database is on fire"));

    const response = await request(app)
      .get("/api/v1/patients")
      .set("Authorization", `Bearer ${token}`);

    // Previously this was flattened to 403 "Access denied", making a
    // database outage indistinguishable from a permission denial.
    expect(response.status).toBeGreaterThanOrEqual(500);
  });
});

describe("permission matrix (src/data/permissions.ts)", () => {
  it("lets an admin read patients", async () => {
    const { token } = await loginAs("admin");

    const response = await request(app)
      .get("/api/v1/patients")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("lets a doctor read patients", async () => {
    const { token } = await loginAs("doctor", "cardiology");

    const response = await request(app)
      .get("/api/v1/patients")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("denies a doctor the ability to delete a patient", async () => {
    const { token } = await loginAs("doctor", "cardiology");

    const response = await request(app)
      .delete("/api/v1/patients/000000000000000000000000")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("denies a non-admin access to admin-only department routes", async () => {
    const { token } = await loginAs("nurse", "emergency");

    const response = await request(app)
      .get("/api/v1/departments")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("allows an admin onto admin-only department routes", async () => {
    const { token } = await loginAs("admin");

    const response = await request(app)
      .get("/api/v1/departments")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("rejects a forged token before any permission check runs", async () => {
    const { user } = await createTestUser({ roleName: "admin" });
    const forged = jwt.sign({ id: user._id }, "wrong-secret");

    const response = await request(app)
      .get("/api/v1/patients")
      .set("Authorization", `Bearer ${forged}`);

    expect(response.status).toBe(401);
  });
});
