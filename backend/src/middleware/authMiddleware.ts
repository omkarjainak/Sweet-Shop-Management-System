import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

// Authenticate JWT token
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = payload;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Admin-only access (includes superadmin)
export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin" && req.user?.role !== "superadmin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Superadmin-only access
export const authorizeSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "superadmin") {
    return res.status(403).json({ message: "Superadmin access required" });
  }
  next();
};
