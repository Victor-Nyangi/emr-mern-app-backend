import request from "supertest";
import type { Application } from "express";
import type * as TestAppHelpers from "./helpers/testApp";

let app: Application;
let helpers: typeof TestAppHelpers;
const originalOpenAiKey = process.env.OPENAI_API_KEY;

const loginAs = async (roleName: string, department = "general") => {
  const { email, password } = await helpers.createTestUser({
    roleName,
    department,
  });
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password });
  return response.body.token as string;
};

describe("emrAi", () => {
  beforeAll(async () => {
    // Force the "key not configured" path regardless of what's sitting in
    // the real .env. This has to happen via require(), not this file's own
    // top-level import -- a static `import ... from "./helpers/testApp"`
    // is hoisted and evaluated before this line runs, which would pull in
    // emrAiController (and its OpenAI client construction) with whatever
    // key dotenv had already loaded, defeating the point of this test.
    process.env.OPENAI_API_KEY = "";
    helpers = require("./helpers/testApp");
    app = await helpers.setupTestApp();
  });

  afterAll(async () => {
    await helpers.teardownTestApp();
    process.env.OPENAI_API_KEY = originalOpenAiKey;
  });

  afterEach(async () => {
    await helpers.clearDatabase();
  });

  it("boots and serves patients/vitals/auth with no OPENAI_API_KEY set", async () => {
    const token = await loginAs("admin");

    const patients = await request(app)
      .get("/api/v1/patients")
      .set("Authorization", `Bearer ${token}`);
    const vitalDefinitions = await request(app)
      .get("/api/v1/vitals/definitions")
      .set("Authorization", `Bearer ${token}`);

    expect(patients.status).toBe(200);
    expect(vitalDefinitions.status).toBe(200);
  });

  it("fails on use with a clear message, not a boot crash, when the key is missing", async () => {
    const token = await loginAs("doctor");

    const response = await request(app)
      .post("/api/v1/ask-ai")
      .set("Authorization", `Bearer ${token}`)
      .send({ question: "What is hypertension?" });

    expect(response.status).toBe(500);
    expect(response.body.message).toMatch(/OPENAI_API_KEY/);
  });

  it("rejects a role without clinical-notes create permission", async () => {
    // Receptionists have no clinical_notes actions at all in
    // src/data/permissions.ts.
    const token = await loginAs("receptionist");

    const response = await request(app)
      .post("/api/v1/ask-ai")
      .set("Authorization", `Bearer ${token}`)
      .send({ question: "What is hypertension?" });

    expect(response.status).toBe(403);
  });

  it("lets a doctor reach the endpoint -- permission granted, fails later only on the missing key", async () => {
    const token = await loginAs("doctor");

    const response = await request(app)
      .post("/api/v1/ask-ai")
      .set("Authorization", `Bearer ${token}`)
      .send({ question: "What is hypertension?" });

    expect(response.status).not.toBe(403);
  });
});
