// Mock Prisma before importing anything that uses it
jest.mock("../prismaClient", () => require("./_mock_/prismaClient"));
import request from "supertest";
import express from "express";
import { prisma } from "../prismaClient";
import * as authController from "../controllers/authControllers";

const app = express();
app.use(express.json());
app.post("/register", authController.register);
app.post("/login", authController.login);

describe("Auth API TDD", () => {
  afterEach(() => jest.clearAllMocks());

  it("registers a new user", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 1, name: "John", email: "john@example.com", role: "user", password: "hashed"
    });

    const res = await request(app).post("/register").send({
      name: "John",
      email: "john@example.com",
      password: "password"
    });

    expect(res.status).toBe(201);
    expect(res.body.user.name).toBe("John");
  });

  it("fails login with invalid credentials", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).post("/login").send({
      email: "wrong@example.com",
      password: "password"
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
});

