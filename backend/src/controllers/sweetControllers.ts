import type { Request, Response } from "express";
import * as sweetService from "../services/sweetService.js";

// Types
interface SweetBody {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

interface QuantityBody {
  quantity: number;
}

interface SweetParams {
  id?: string; 
}

// Add new sweet
export const addSweet = async (req: Request<{}, {}, SweetBody>, res: Response) => {
  const { name, category, price, quantity } = req.body;
  if (!name || !category || price === undefined || quantity === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const sweet = await sweetService.addSweet(name, category, price, quantity);
    res.status(201).json(sweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Get all sweets
export const getSweets = async (_req: Request, res: Response) => {
  try {
    const sweets = await sweetService.getAllSweets();
    res.json(sweets);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Search sweets
export const searchSweets = async (req: Request<{}, {}, {}, any>, res: Response) => {
  try {
    const sweets = await sweetService.searchSweets(req.query);
    res.json(sweets);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update sweet
export const updateSweet = async (req: Request<SweetParams, {}, SweetBody>, res: Response) => {
  const id = parseInt(req.params.id ?? "0");
  if (!req.params.id || isNaN(id)) return res.status(400).json({ message: "Invalid sweet ID" });

  try {
    const sweet = await sweetService.updateSweet(id, req.body);
    res.json(sweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete sweet
export const deleteSweet = async (req: Request<SweetParams>, res: Response) => {
  const id = parseInt(req.params.id ?? "0");
  if (!req.params.id || isNaN(id)) return res.status(400).json({ message: "Invalid sweet ID" });

  try {
    const sweet = await sweetService.deleteSweet(id);
    res.json({ message: "Sweet deleted", sweet });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Purchase sweet
export const purchaseSweet = async (req: Request<SweetParams, {}, QuantityBody>, res: Response) => {
  const id = parseInt(req.params.id ?? "0");
  const { quantity } = req.body;
  if (!req.params.id || isNaN(id)) return res.status(400).json({ message: "Invalid sweet ID" });
  if (!quantity || quantity <= 0) return res.status(400).json({ message: "Quantity must be greater than 0" });

  try {
    const sweet = await sweetService.purchaseSweet(id, quantity);
    res.json(sweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Restock sweet
export const restockSweet = async (req: Request<SweetParams, {}, QuantityBody>, res: Response) => {
  const id = parseInt(req.params.id ?? "0");
  const { quantity } = req.body;
  if (!req.params.id || isNaN(id)) return res.status(400).json({ message: "Invalid sweet ID" });
  if (!quantity || quantity <= 0) return res.status(400).json({ message: "Quantity must be greater than 0" });

  try {
    const sweet = await sweetService.restockSweet(id, quantity);
    res.json(sweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
