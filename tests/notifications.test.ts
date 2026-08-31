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

const createNotification = (body: Record<string, unknown>) =>
  request(app).post("/api/v1/notifications").set(auth()).send(body);

describe("POST /notifications validation", () => {
  /**
   * The route used to hand-roll `if (!message)`. That caught an absent
   * message but not an empty or whitespace-only one, and it said nothing
   * about `type`. The schema now owns both.
   */
  it("rejects a missing message", async () => {
    const response = await createNotification({ type: "info" });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/message/);
  });

  it("rejects a whitespace-only message", async () => {
    const response = await createNotification({ message: "   " });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/message/);
  });

  /**
   * `type` is an enum on the Notification model. Mongoose would have
   * rejected this too, but as a 500-shaped ValidationError after the
   * write was attempted rather than a 400 before it.
   */
  it("rejects a type outside the model's enum", async () => {
    const response = await createNotification({
      message: "Lab results ready",
      type: "catastrophe",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/type/);
  });

  it("accepts a valid payload and defaults type to info", async () => {
    const response = await createNotification({ message: "Lab results ready" });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Lab results ready");
    expect(response.body.type).toBe("info");
    expect(response.body.read).toBe(false);
  });

  it.each(["info", "success", "warning", "error"])(
    "accepts the %s type from the model enum",
    async (type) => {
      const response = await createNotification({ message: "Heads up", type });

      expect(response.status).toBe(201);
      expect(response.body.type).toBe(type);
    },
  );

  /**
   * The handler binds `user` to the authenticated caller. stripUnknown
   * means a caller cannot smuggle a different owner in through the body.
   */
  it("ignores a user sent in the body and binds the caller instead", async () => {
    const someoneElse = oid();
    const response = await createNotification({
      message: "Not yours",
      user: someoneElse,
    });

    expect(response.status).toBe(201);
    expect(response.body.user).not.toBe(someoneElse);
  });
});

describe("PATCH /notifications/:id/read validation", () => {
  /**
   * `req.params.id` used to go straight into findOneAndUpdate. That was
   * already a 400 rather than a 500 -- errorMiddleware translates a
   * Mongoose CastError -- but only after the bad id had reached the
   * driver, and the reply leaked the internal field name
   * ("Invalid _id: not-an-object-id"). Validating the param stops it at
   * the middleware, so the message names the route param the caller
   * actually sent and no query is issued at all.
   */
  it("rejects a malformed id at the middleware, not at Mongoose", async () => {
    const response = await request(app)
      .patch("/api/v1/notifications/not-an-object-id/read")
      .set(auth());

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/must be a valid id/);
    expect(response.body.message).not.toMatch(/_id/);
  });

  it("still 404s for a well-formed id that matches nothing", async () => {
    const response = await request(app)
      .patch(`/api/v1/notifications/${oid()}/read`)
      .set(auth());

    expect(response.status).toBe(404);
  });

  it("marks the caller's own notification as read", async () => {
    const created = await createNotification({ message: "Please read me" });
    expect(created.status).toBe(201);

    const response = await request(app)
      .patch(`/api/v1/notifications/${created.body._id}/read`)
      .set(auth());

    expect(response.status).toBe(200);
    expect(response.body.read).toBe(true);
  });
});
