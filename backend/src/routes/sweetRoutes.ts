import express from "express";
import * as sweetController from "../controllers/sweetControllers.js";
import { authenticateJWT, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", sweetController.getSweets);
router.get("/search", sweetController.searchSweets);

// Admin routes
router.post("/", authenticateJWT, authorizeAdmin, sweetController.addSweet);
router.put("/:id", authenticateJWT, authorizeAdmin, sweetController.updateSweet);
router.delete("/:id", authenticateJWT, authorizeAdmin, sweetController.deleteSweet);

// Purchase (user) and restock (admin)
router.post("/:id/purchase", authenticateJWT, sweetController.purchaseSweet);
router.post("/:id/restock", authenticateJWT, authorizeAdmin, sweetController.restockSweet);

export default router;
