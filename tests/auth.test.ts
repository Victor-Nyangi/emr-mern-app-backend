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

let app: Application;

beforeAll(async () => {
  app = await setupTestApp();
});

afterAll(async () => {
  await teardownTestApp();
});

afterEach(async () => {
  await clearDatabase();
});

describe("POST /api/v1/auth/login", () => {
  it("returns a token and the caller's permissions on valid credentials", async () => {
    const { email, password } = await createTestUser({ roleName: "doctor" });

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    expect(response.status).toBe(200);
    expect(typeof response.body.token).toBe("string");
    expect(response.body.email).toBe(email);
    expect(Array.isArray(response.body.permissions)).toBe(true);
  });

  it("rejects a wrong password without revealing whether the user exists", async () => {
    const { email } = await createTestUser({ roleName: "doctor" });

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password: "wrong-password" });

    expect(response.status).toBe(400);
  });

  it("rejects an unknown email", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "nobody@test.local", password: "whatever" });

    expect(response.status).toBe(400);
  });

  it("issues a token that expires within the session lifetime", async () => {
    const { email, password } = await createTestUser({ roleName: "doctor" });

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    const decoded: any = jwt.verify(response.body.token, config.JWT_SECRET);
    const ttlSeconds = decoded.exp - decoded.iat;

    // 8 hours, not the 30 days this previously issued.
    expect(ttlSeconds).toBe(8 * 60 * 60);
  });
});

describe("GET /api/v1/auth/me", () => {
  it("returns the authenticated user", async () => {
    const { email, password } = await createTestUser({ roleName: "doctor" });

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(email);
  });

  it("rejects a request with no Authorization header", async () => {
    const response = await request(app).get("/api/v1/auth/me");

    expect(response.status).toBe(401);
  });

  it("rejects a malformed token", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer not-a-real-token");

    expect(response.status).toBe(401);
  });

  it("rejects a token signed with the wrong secret", async () => {
    const { user } = await createTestUser({ roleName: "doctor" });
    const forged = jwt.sign({ id: user._id }, "not-the-real-secret");

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${forged}`);

    expect(response.status).toBe(401);
  });

  it("rejects an expired token", async () => {
    const { user } = await createTestUser({ roleName: "doctor" });
    const expired = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "-1s",
    });

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${expired}`);

    expect(response.status).toBe(401);
  });
});

describe("POST /api/v1/auth/register", () => {
  it("rejects unauthenticated callers", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "Walk In",
      email: "walkin@test.local",
      password: "password",
      role: "000000000000000000000000",
      department: "general",
      employee_id: "EMP-999",
    });

    expect(response.status).toBe(401);
  });

  it("rejects an authenticated non-admin", async () => {
    const { email, password } = await createTestUser({ roleName: "nurse" });

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    const response = await request(app)
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({
        name: "Walk In",
        email: "walkin@test.local",
        password: "password",
        role: "000000000000000000000000",
        department: "general",
        employee_id: "EMP-999",
      });

    expect(response.status).toBe(403);
  });

  it("lets an admin create a staff account without issuing them a token", async () => {
    const { email, password, role } = await createTestUser({
      roleName: "admin",
    });

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    const response = await request(app)
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({
        name: "New Nurse",
        email: "new.nurse@test.local",
        password: "password",
        role: role._id.toString(),
        department: "emergency",
        employee_id: "EMP-1234",
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe("new.nurse@test.local");
    expect(response.body.token).toBeUndefined();
  });

  it("rejects a creation missing role, department or employee_id", async () => {
    const { email, password } = await createTestUser({ roleName: "admin" });

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    const response = await request(app)
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({
        name: "Incomplete",
        email: "incomplete@test.local",
        password: "password",
      });

    expect(response.status).toBe(400);
  });
});
