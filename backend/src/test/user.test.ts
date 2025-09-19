jest.mock("../prismaClient", () => require("./_mock_/prismaClient"));
import request from "supertest";
import express from "express";
import { prisma } from "../prismaClient";
import * as userController from "../controllers/userControllers";

const app = express();
app.use(express.json());
app.get("/users", userController.getAllUsers);
app.put("/users/:id/role", userController.updateUserRole);

describe("User API TDD", () => {
  afterEach(() => jest.clearAllMocks());

  it("gets all users", async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([
      { id: 1, name: "John", email: "john@example.com", role: "user" }
    ]);

    const res = await request(app).get("/users");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("updates user role successfully", async () => {
    (prisma.user.update as jest.Mock).mockResolvedValue({
      id: 1, name: "John", email: "john@example.com", role: "admin"
    });

    const res = await request(app).put("/users/1/role").send({ role: "admin" });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe("admin");
  });
});
