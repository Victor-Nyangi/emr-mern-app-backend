import request from "supertest";
import { Application } from "express";

import {
  setupTestApp,
  teardownTestApp,
  clearDatabase,
  createTestUser,
} from "./helpers/testApp";

let app: Application;
let token: string;

const MISSING_ID = "000000000000000000000000";
const MALFORMED_ID = "not-a-valid-object-id";

beforeAll(async () => {
  app = await setupTestApp();
});

afterAll(async () => {
  await teardownTestApp();
});

beforeEach(async () => {
  await clearDatabase();
  const { email, password } = await createTestUser({ roleName: "admin" });
  const login = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password });
  token = login.body.token;
});

/**
 * These controllers all shared the same defect: an early exit written as
 *
 *     if (!thing) res.status(404).json({ message: "..." });
 *
 * with no return, so the handler carried on and sent a second response.
 * The first send won, the second threw ERR_HTTP_HEADERS_SENT inside the
 * try, the catch called handleError, and that threw again. A simple
 * not-found was a hard failure rather than a clean 404.
 */
const resources = [
  "patients",
  "drugs",
  "services",
  "departments",
  "medical-providers",
  "visits",
  "queues",
  "billings",
  "diagnosis",
  "tests",
  "medications",
  "insurance/insurers",
  "insurance/policies",
  "insurance/benefit-plans",
];

describe.each(resources)("GET /api/v1/%s/:id", (resource) => {
  it("returns a clean JSON 404 for an id that does not exist", async () => {
    const response = await request(app)
      .get(`/api/v1/${resource}/${MISSING_ID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(typeof response.body.message).toBe("string");
  });

  it("returns a clean JSON 400 for a malformed id", async () => {
    const response = await request(app)
      .get(`/api/v1/${resource}/${MALFORMED_ID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(typeof response.body.message).toBe("string");
  });

  // The unguarded ObjectId.isValid checks lived on these two verbs, so
  // they double-sent on a malformed id where GET did not.
  it("PATCH returns a clean JSON error for a malformed id", async () => {
    const response = await request(app)
      .patch(`/api/v1/${resource}/${MALFORMED_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
    expect(response.type).toBe("application/json");
    expect(typeof response.body.message).toBe("string");
  });

  it("DELETE returns a clean JSON error for a malformed id", async () => {
    const response = await request(app)
      .delete(`/api/v1/${resource}/${MALFORMED_ID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);
    expect(response.type).toBe("application/json");
    expect(typeof response.body.message).toBe("string");
  });
});
