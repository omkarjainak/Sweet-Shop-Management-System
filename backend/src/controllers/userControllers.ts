// src/controllers/userController.ts
import { prisma } from "../prismaClient.js";
import type { Request, Response } from "express";

// Get all users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { id: "asc" },
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !["user", "admin", "superadmin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json(updatedUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
