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

describe("visit invoices", () => {
  it("has no route at /invoice -- it was unadapted boilerplate that always threw", async () => {
    const response = await request(app)
      .post("/api/v1/visit-invoices/invoice")
      .set("Authorization", `Bearer ${token}`)
      .send({ clientId: "PH-B", items: [{ quantity: 2 }], paid: 0 });

    expect(response.status).toBe(404);
  });
});
