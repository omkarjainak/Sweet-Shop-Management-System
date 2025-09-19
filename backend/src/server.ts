import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sweetRoutes from "./routes/sweetRoutes.js"; 
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();

// Enable CORS using env variable
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({
  origin: frontendUrl,
  credentials: true, // if you plan to use cookies
}));

// Parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
