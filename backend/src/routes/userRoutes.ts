import express from "express";
import { authenticateJWT, authorizeSuperAdmin } from "../middleware/authMiddleware.js";
import * as userController from "../controllers/userControllers.js";

const router = express.Router();

// Superadmin protected routes
router.get("/", authenticateJWT, authorizeSuperAdmin, userController.getAllUsers);
router.put("/:id/role", authenticateJWT, authorizeSuperAdmin, userController.updateUserRole);

export default router;
