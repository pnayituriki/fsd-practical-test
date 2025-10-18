import request from "supertest";
import { app } from "../..";

const BASE_URL = "/api/users";

describe("Users API", () => {
  it("should list users", async () => {
    const res = await request(app).get(BASE_URL);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should create a new user", async () => {
    const randomEmail = `test_${Date.now()}@example.com`;

    const res = await request(app)
      .post(BASE_URL)
      .send({ email: randomEmail, role: "admin", status: "active" });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBeDefined();
    expect(res.body.data.signature).toBeDefined();
  });

  it("should export users in protobuf format", async () => {
    const res = await request(app).get(`${BASE_URL}/export`);
    expect(res.status).toBe(200);
    expect(Buffer.isBuffer(res.body) || typeof res.body === "object").toBe(
      true
    );
  });
});
