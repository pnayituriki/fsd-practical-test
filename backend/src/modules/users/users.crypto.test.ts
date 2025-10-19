import request from "supertest";
import { verify } from "crypto";
import { app } from "../../index";

const BASE_URL ='/api'

describe("Users + Crypto Integration (E2E)", () => {
  let publicKeyPem: string;

  beforeAll(async () => {
    const res = await request(app).get(`${BASE_URL}/crypto/public-key`);
    expect(res.status).toBe(200);
    publicKeyPem = res.text;
  });

  it("should create a new user with a valid digital signature", async () => {
    const randomEmail = `user_${Date.now()}@example.com`;

    // 1. Create a new user
    const createRes = await request(app)
      .post(`${BASE_URL}/users`)
      .send({ email: randomEmail, role: "user", status: "active" });

    expect(createRes.status).toBe(201);
  });
});
