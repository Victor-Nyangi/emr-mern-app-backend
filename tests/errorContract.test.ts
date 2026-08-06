import request from "supertest";
import { Application } from "express";

import {
  setupTestApp,
  teardownTestApp,
  clearDatabase,
  createTestUser,
} from "./helpers/testApp";
import AuthorizationService from "../src/services/authorizationService";

let app: Application;

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

/**
 * The frontend calls response.json() on every reply. Any HTML error page
 * throws a SyntaxError there, which its catch converted into an empty
 * result set -- so a backend failure rendered as an empty table. Every
 * error path must therefore be JSON with a message.
 */
describe("every error path responds with JSON", () => {
  it("returns JSON for an unmatched route", async () => {
    const response = await request(app).get("/api/v1/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(typeof response.body.message).toBe("string");
  });

  it("returns JSON for an unauthenticated request", async () => {
    const response = await request(app).get("/api/v1/patients");

    expect(response.status).toBe(401);
    expect(response.type).toBe("application/json");
    expect(typeof response.body.message).toBe("string");
  });

  it("returns JSON for a permission denial", async () => {
    const { email, password } = await createTestUser({
      roleName: "receptionist",
    });
    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    const response = await request(app)
      .delete("/api/v1/patients/000000000000000000000000")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toBe(403);
    expect(response.type).toBe("application/json");
    expect(typeof response.body.message).toBe("string");
  });

  it("returns JSON for an unexpected internal failure", async () => {
    const { email, password } = await createTestUser({ roleName: "doctor" });
    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    jest
      .spyOn(AuthorizationService, "checkPermission")
      .mockRejectedValue(new Error("database is on fire"));

    const response = await request(app)
      .get("/api/v1/patients")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toBeGreaterThanOrEqual(500);
    expect(response.type).toBe("application/json");
    expect(typeof response.body.message).toBe("string");
  });

  it("does not leak a stack trace in production", async () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    try {
      const response = await request(app).get("/api/v1/does-not-exist");

      expect(response.body.stack).toBeUndefined();
    } finally {
      process.env.NODE_ENV = previous;
    }
  });
});
