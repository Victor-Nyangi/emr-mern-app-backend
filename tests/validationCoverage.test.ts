import request from "supertest";
import { Application } from "express";
import mongoose from "mongoose";

import {
  setupTestApp,
  teardownTestApp,
  clearDatabase,
  createTestUser,
} from "./helpers/testApp";

let app: Application;
let token: string;

const oid = () => new mongoose.Types.ObjectId().toString();

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

/**
 * Every router that gained validation, with a body that should fail.
 *
 * These assert the *rejection* rather than the happy path: the point is
 * that a bad request now stops at the middleware with a readable message
 * instead of reaching Mongoose (a CastError) or the database (a
 * half-built document).
 */
describe.each([
  ["visits", "/api/v1/visits", { payment_method: "Barter" }, /payment_method/],
  [
    "appointments",
    "/api/v1/appointments",
    { patient_id: oid(), status: "Scheduled" },
    /medicalProvider_id/,
  ],
  [
    "billing",
    "/api/v1/billings",
    {
      patient_name: "Ada",
      visit_id: oid(),
      insuranceProvider: oid(),
      amount: -5,
    },
    /amount/,
  ],
  [
    "clinical notes",
    "/api/v1/clinical-notes",
    { patient_id: oid(), medicalProvider_id: oid() },
    /content/,
  ],
  [
    "queues",
    "/api/v1/queues",
    { name: "Triage", departmentId: oid(), priority: "WHENEVER" },
    /priority/,
  ],
  [
    "vitals",
    "/api/v1/vitals",
    { patient_id: oid(), visit_id: oid(), weight: -3 },
    /weight/,
  ],
  [
    "financials",
    "/api/v1/financials",
    { patient_name: "Ada", account_name: "Ada" },
    /account_number/,
  ],
  [
    "diagnosis",
    "/api/v1/diagnosis",
    { visit_id: oid(), medicalProvider_id: oid(), diagnosis: "Flu" },
    /code/,
  ],
  [
    "medications",
    "/api/v1/medications",
    {
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "BD",
      startDate: "2025-06-01",
      endDate: "2025-01-01",
      prescribedBy: oid(),
      patientId: oid(),
      visitId: oid(),
    },
    /endDate/,
  ],
  [
    "tests",
    "/api/v1/tests",
    { testName: "CBC", visit_id: oid() },
    /ordered_by/,
  ],
  [
    "medical providers",
    "/api/v1/medical-providers",
    { first_name: "Ada", last_name: "Lovelace", email: "not-an-email" },
    /email/,
  ],
  [
    "visit clinical notes",
    "/api/v1/visit-clinical-notes",
    { visit_id: oid(), medicalProvider_id: oid() },
    /content/,
  ],
  [
    "visit treatments",
    "/api/v1/visit-treatments",
    {
      visitId: oid(),
      medicalProvider_id: oid(),
      name: "Debridement",
      startDate: "2025-06-01",
      endDate: "2025-01-01",
    },
    /endDate/,
  ],
  [
    "visit invoices",
    "/api/v1/visit-invoices",
    {
      visitId: oid(),
      service_charged: "Consultation",
      invoiceNumber: "INV-1",
      amount: 100,
      copayAmount: -1,
    },
    /copayAmount/,
  ],
  [
    "insurers",
    "/api/v1/insurance/insurers",
    { name: "AAR", panel: "Tier IX" },
    /panel/,
  ],
  [
    "policies",
    "/api/v1/insurance/policies",
    {
      patientId: oid(),
      benefitPlanId: oid(),
      policyNumber: "P-1",
      effectiveDate: "2025-06-01",
      expiryDate: "2025-01-01",
    },
    /expiryDate/,
  ],
  [
    "benefit plans",
    "/api/v1/insurance/benefit-plans",
    { name: "Gold", insurerId: "not-an-id" },
    /insurerId/,
  ],
])("%s validation", (_name, path, body, expected) => {
  it("rejects an invalid create with a message naming the field", async () => {
    const response = await request(app).post(path).set(auth()).send(body);

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(expected);
  });

  it("rejects an empty PATCH body", async () => {
    const response = await request(app)
      .patch(`${path}/${oid()}`)
      .set(auth())
      .send({});

    expect(response.status).toBe(400);
  });
});

describe("visit transitions", () => {
  const createVisit = async () => {
    const patient = await request(app)
      .post("/api/v1/patients")
      .set(auth())
      .send({
        first_name: "Ada",
        last_name: "Lovelace",
        date_of_birth: "1990-01-01",
        gender: "female",
        salutation: "Ms",
        blood_group: "O+",
        emergency_contact: "700000001",
        phone_number: "700000000",
        email: "ada@test.local",
      });

    const queue = await request(app)
      .post("/api/v1/queues")
      .set(auth())
      .send({ name: "Triage", departmentId: oid() });

    return request(app).post("/api/v1/visits").set(auth()).send({
      patient_id: patient.body._id,
      payment_method: "Cash",
      currentQueue: queue.body._id,
    });
  };

  it("creates a visit through the schema", async () => {
    const response = await createVisit();
    expect(response.status).toBe(201);
    expect(response.body.status).toBe("ARRIVED");
  });

  /**
   * This is the regression that motivated the change. The controller ran
   * `if (!req.body || !status) { res.status(400).send(...) }` with no
   * return, so a transition with no status sent a 400 and then carried on
   * to send a second response -- ERR_HTTP_HEADERS_SENT, not a clean 400.
   */
  it("rejects a transition with no status instead of double-sending", async () => {
    const visit = await createVisit();

    const response = await request(app)
      .patch(`/api/v1/visits/transition/${visit.body._id}`)
      .set(auth())
      .send({ transition: { queue: oid(), prev_queue: oid() } });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/status/);
  });

  it("rejects a status outside the visit lifecycle", async () => {
    const visit = await createVisit();

    const response = await request(app)
      .patch(`/api/v1/visits/transition/${visit.body._id}`)
      .set(auth())
      .send({ status: "TELEPORTED" });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/status/);
  });

  it("rejects a transition whose queue is not an id", async () => {
    const visit = await createVisit();

    const response = await request(app)
      .patch(`/api/v1/visits/transition/${visit.body._id}`)
      .set(auth())
      .send({
        status: "IN PROGRESS",
        transition: { queue: "Consultation" },
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/queue/);
  });
});

describe("queue routes", () => {
  /**
   * queue-api.ts registered `router.patch("/:id")` twice. Express matches
   * the first, so deleteQueue was unreachable -- a DELETE fell through to
   * the 404 handler and a PATCH always hit update. deleteQueue now sits on
   * DELETE, matching every other router.
   */
  it("deletes a queue over DELETE", async () => {
    const created = await request(app)
      .post("/api/v1/queues")
      .set(auth())
      .send({ name: "Triage", departmentId: oid() });

    const response = await request(app)
      .delete(`/api/v1/queues/${created.body._id}`)
      .set(auth());

    expect(response.status).toBe(200);

    const after = await request(app)
      .get(`/api/v1/queues/${created.body._id}`)
      .set(auth());
    expect(after.status).toBe(404);
  });

  it("does not delete on PATCH", async () => {
    const created = await request(app)
      .post("/api/v1/queues")
      .set(auth())
      .send({ name: "Triage", departmentId: oid() });

    await request(app)
      .patch(`/api/v1/queues/${created.body._id}`)
      .set(auth())
      .send({ name: "Renamed" });

    const after = await request(app)
      .get(`/api/v1/queues/${created.body._id}`)
      .set(auth());

    expect(after.status).toBe(200);
    expect(after.body.name).toBe("Renamed");
  });
});

describe("unknown field stripping", () => {
  it("drops fields the schema does not declare", async () => {
    const response = await request(app)
      .post("/api/v1/financials")
      .set(auth())
      .send({
        patient_name: "Ada",
        account_name: "Ada Lovelace",
        account_number: "0123456789",
        account_type: "Savings",
        balance: 999999,
      });

    expect(response.status).toBe(201);
    expect(response.body.balance).toBeUndefined();
  });

  it("keeps the flexible Mixed fields on a benefit plan", async () => {
    const insurer = await request(app)
      .post("/api/v1/insurance/insurers")
      .set(auth())
      .send({ name: "AAR", panel: "Tier I" });

    const response = await request(app)
      .post("/api/v1/insurance/benefit-plans")
      .set(auth())
      .send({
        name: "Gold",
        insurerId: insurer.body._id,
        coverageDetails: { inpatient: true, limit: 500000 },
      });

    expect(response.status).toBe(201);
    expect(response.body.coverageDetails).toEqual({
      inpatient: true,
      limit: 500000,
    });
  });
});
