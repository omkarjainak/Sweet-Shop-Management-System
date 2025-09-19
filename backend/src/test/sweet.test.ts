jest.mock("../prismaClient", () => require("./_mock_/prismaClient"));
import request from "supertest";
import express from "express";
import { prisma } from "../prismaClient";
import * as sweetController from "../controllers/sweetControllers";

const app = express();
app.use(express.json());
app.get("/sweets", sweetController.getSweets);
app.post("/sweets", sweetController.addSweet);
app.put("/sweets/:id", sweetController.updateSweet);
app.delete("/sweets/:id", sweetController.deleteSweet);
app.post("/sweets/:id/purchase", sweetController.purchaseSweet);
app.post("/sweets/:id/restock", sweetController.restockSweet);

describe("Sweet API TDD", () => {
  afterEach(() => jest.clearAllMocks());

  it("fails to add sweet with missing fields", async () => {
    const res = await request(app).post("/sweets").send({ name: "Candy" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing required fields");
  });

  it("adds sweet successfully", async () => {
    (prisma.sweet.create as jest.Mock).mockResolvedValue({
      id: 1, name: "Candy", category: "Chocolates", price: 10, quantity: 5
    });

    const res = await request(app).post("/sweets").send({
      name: "Candy", category: "Chocolates", price: 10, quantity: 5
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Candy");
  });

  it("gets all sweets", async () => {
    (prisma.sweet.findMany as jest.Mock).mockResolvedValue([
      { id: 1, name: "Candy", category: "Chocolates", price: 10, quantity: 5 }
    ]);

    const res = await request(app).get("/sweets");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("updates sweet successfully", async () => {
    (prisma.sweet.update as jest.Mock).mockResolvedValue({
      id: 1, name: "Candy Updated", category: "Chocolates", price: 12, quantity: 5
    });

    const res = await request(app).put("/sweets/1").send({ name: "Candy Updated", price: 12 });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Candy Updated");
  });

  it("deletes sweet successfully", async () => {
    (prisma.sweet.delete as jest.Mock).mockResolvedValue({
      id: 1, name: "Candy", category: "Chocolates", price: 10, quantity: 5
    });

    const res = await request(app).delete("/sweets/1");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Sweet deleted");
  });
});
