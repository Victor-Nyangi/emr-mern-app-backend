import request from "supertest";
import { Application } from "express";

import {
  setupTestApp,
  teardownTestApp,
  clearDatabase,
  createTestUser,
} from "./helpers/testApp";
import { vitalDefinitions } from "../src/data/vitalDefinitions";

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
  const { email, password } = await createTestUser({ roleName: "nurse" });
  const login = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password });
  token = login.body.token;
});

const auth = () => ({ Authorization: `Bearer ${token}` });

describe("GET /api/v1/vitals/definitions", () => {
  it("requires authentication", async () => {
    const response = await request(app).get("/api/v1/vitals/definitions");

    expect(response.status).toBe(401);
  });

  it("returns the checked-in definition table verbatim to any authenticated role", async () => {
    const response = await request(app)
      .get("/api/v1/vitals/definitions")
      .set(auth());

    expect(response.status).toBe(200);
    expect(response.body).toEqual(vitalDefinitions);
  });

  it("keeps reference ranges as structured bounds, not formatted strings", async () => {
    const response = await request(app)
      .get("/api/v1/vitals/definitions")
      .set(auth());

    const pulse = response.body.find((d: any) => d.name === "pulse_rate");

    expect(pulse.range).toEqual({
      low: { min: 0, max: 59 },
      normal: { min: 60, max: 100 },
      high: { min: 101, max: 200 },
    });
    expect(typeof pulse.range.low.min).toBe("number");
  });

  it("attaches a LOINC coding to every definition", async () => {
    const response = await request(app)
      .get("/api/v1/vitals/definitions")
      .set(auth());

    for (const definition of response.body) {
      expect(definition.loinc).toEqual(
        expect.objectContaining({
          system: "http://loinc.org",
          code: expect.any(String),
        }),
      );
    }
  });

  it("decomposes the blood pressure panel into systolic/diastolic components", async () => {
    const response = await request(app)
      .get("/api/v1/vitals/definitions")
      .set(auth());

    const bloodPressure = response.body.find(
      (d: any) => d.name === "blood_pressure",
    );

    expect(bloodPressure.components).toEqual([
      expect.objectContaining({ name: "systolic" }),
      expect.objectContaining({ name: "diastolic" }),
    ]);
  });
});
