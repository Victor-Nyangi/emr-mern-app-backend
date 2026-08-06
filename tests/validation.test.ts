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

const validPatient = {
  first_name: "Ada",
  last_name: "Lovelace",
  date_of_birth: "1990-01-01",
  gender: "female",
  salutation: "Ms",
  blood_group: "O+",
  emergency_contact: "700000001",
  phone_number: "700000000",
  email: "ada@test.local",
};

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

const auth = () => ({ Authorization: `Bearer ${token}` });

describe("request validation", () => {
  it("rejects a create missing required fields, naming all of them at once", async () => {
    const response = await request(app)
      .post("/api/v1/patients")
      .set(auth())
      .send({ first_name: "Ada" });

    expect(response.status).toBe(400);
    // abortEarly: false, so one round-trip reports every problem.
    expect(response.body.message).toMatch(/last_name/);
    expect(response.body.message).toMatch(/date_of_birth/);
  });

  it("rejects a malformed email", async () => {
    const response = await request(app)
      .post("/api/v1/patients")
      .set(auth())
      .send({ ...validPatient, email: "not-an-email" });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/email/);
  });

  it("accepts an internal-domain email rather than checking the TLD registry", async () => {
    const response = await request(app)
      .post("/api/v1/patients")
      .set(auth())
      .send({ ...validPatient, email: "clinician@hospital.internal" });

    expect(response.status).toBe(201);
  });

  it("rejects a future date of birth", async () => {
    const response = await request(app)
      .post("/api/v1/patients")
      .set(auth())
      .send({ ...validPatient, date_of_birth: "2999-01-01" });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/date_of_birth/);
  });

  it("strips unknown fields instead of persisting them", async () => {
    const response = await request(app)
      .post("/api/v1/patients")
      .set(auth())
      .send({ ...validPatient, is_admin: true, _id: "deadbeefdeadbeefdeadbeef" });

    expect(response.status).toBe(201);
    expect(response.body.is_admin).toBeUndefined();
    // The caller's _id was dropped, so Mongo assigned its own.
    expect(response.body._id).not.toBe("deadbeefdeadbeefdeadbeef");
  });

  it("rejects an empty PATCH body", async () => {
    const created = await request(app)
      .post("/api/v1/patients")
      .set(auth())
      .send(validPatient);

    const response = await request(app)
      .patch(`/api/v1/patients/${created.body._id}`)
      .set(auth())
      .send({});

    expect(response.status).toBe(400);
  });

  it("rejects a negative service charge", async () => {
    const response = await request(app)
      .post("/api/v1/services")
      .set(auth())
      .send({
        name: "Consultation",
        description: "General consultation",
        charge: -50,
        main_purpose: "consultation",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/charge/);
  });

  it("rejects a drug whose expiry precedes its manufacture date", async () => {
    const response = await request(app)
      .post("/api/v1/drugs")
      .set(auth())
      .send({
        name: "Amoxicillin",
        description: "Antibiotic",
        manufacter_date: "2025-01-01",
        expiry_date: "2024-01-01",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/expiry_date/);
  });

  it("rejects a department type outside the allowed set", async () => {
    const response = await request(app)
      .post("/api/v1/departments")
      .set(auth())
      .send({ name: "Oncology", description: "Cancer care", type: "Bogus" });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/type/);
  });

  it("rejects a login with no password", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "someone@test.local" });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/password/);
  });

  it("rejects a staff account with a short password", async () => {
    const { role } = await createTestUser({
      roleName: "nurse",
      email: "n@test.local",
    });

    const response = await request(app)
      .post("/api/v1/auth/register")
      .set(auth())
      .send({
        name: "New Nurse",
        email: "new@test.local",
        password: "short",
        role: role._id.toString(),
        department: "emergency",
        employee_id: "EMP-77",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/password/);
  });

  it("rejects a staff account in an unknown department", async () => {
    const { role } = await createTestUser({
      roleName: "nurse",
      email: "n2@test.local",
    });

    const response = await request(app)
      .post("/api/v1/auth/register")
      .set(auth())
      .send({
        name: "New Nurse",
        email: "new2@test.local",
        password: "long-enough-password",
        role: role._id.toString(),
        department: "astrology",
        employee_id: "EMP-78",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/department/);
  });
});
