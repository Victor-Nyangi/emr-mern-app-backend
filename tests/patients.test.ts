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
  address: "12 Analytical Way",
  phone_number: "700000000",
  email: "ada@test.local",
  date_of_birth: "1990-01-01",
  gender: "female",
  salutation: "Ms",
  blood_group: "O+",
  emergency_contact: "700000001",
  is_active: true,
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

describe("patient CRUD", () => {
  it("creates and lists a patient", async () => {
    const created = await request(app)
      .post("/api/v1/patients")
      .set(auth())
      .send(validPatient);

    expect(created.status).toBe(201);
    expect(created.body.first_name).toBe("Ada");

    const list = await request(app).get("/api/v1/patients").set(auth());

    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
  });

  it("fetches a patient by id", async () => {
    const created = await request(app)
      .post("/api/v1/patients")
      .set(auth())
      .send(validPatient);

    const response = await request(app)
      .get(`/api/v1/patients/${created.body._id}`)
      .set(auth());

    expect(response.status).toBe(200);
    expect(response.body.email).toBe("ada@test.local");
  });

  it("returns a clean 404 for an id that does not exist", async () => {
    const response = await request(app)
      .get("/api/v1/patients/000000000000000000000000")
      .set(auth());

    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.message).toMatch(/not found/i);
  });

  it("returns 400 for a malformed id rather than a server error", async () => {
    const response = await request(app)
      .get("/api/v1/patients/not-a-valid-object-id")
      .set(auth());

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/invalid/i);
  });

  it("updates a patient", async () => {
    const created = await request(app)
      .post("/api/v1/patients")
      .set(auth())
      .send(validPatient);

    const response = await request(app)
      .patch(`/api/v1/patients/${created.body._id}`)
      .set(auth())
      .send({ last_name: "Byron" });

    expect(response.status).toBe(200);
    expect(response.body.last_name).toBe("Byron");
  });

  it("returns 404 when updating a patient that does not exist", async () => {
    const response = await request(app)
      .patch("/api/v1/patients/000000000000000000000000")
      .set(auth())
      .send({ last_name: "Byron" });

    expect(response.status).toBe(404);
  });

  it("deletes a patient", async () => {
    const created = await request(app)
      .post("/api/v1/patients")
      .set(auth())
      .send(validPatient);

    const response = await request(app)
      .delete(`/api/v1/patients/${created.body._id}`)
      .set(auth());

    expect(response.status).toBe(200);

    const list = await request(app).get("/api/v1/patients").set(auth());
    expect(list.body).toHaveLength(0);
  });

  it("returns 404 when deleting a patient that does not exist", async () => {
    const response = await request(app)
      .delete("/api/v1/patients/000000000000000000000000")
      .set(auth());

    expect(response.status).toBe(404);
  });
});
