import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectDb from "./config/db.js";
import cors from "cors";
import { authMiddleware } from "./middlewares/authMiddleware.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/dashboard", authMiddleware, (req, res) => {
  try {
    res.send("Succesfully Authenticated");
  } catch (error) {
    res.status(500).json({message: "Dashboard Access Error"})
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectDb();
  console.log(`Listening to Port:${PORT} `);
});
