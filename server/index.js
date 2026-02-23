import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import notesRouter from "./routes/notes.routes.js";
import pdfRouter from "./routes/pdf.routes.js";
import creditRouter from "./routes/credit.routes.js";

import cookieParser from "cookie-parser";
import { stripeWebhook } from "./controllers/credits.controller.js";

dotenv.config();


const app = express();

app.post(
  "/api/credits/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

const PORT = process.env.PORT || 8000;

app.get('/',(req,res)=>{
  res.json({"message":"Welcome to Exam Notes Genrator API ...."});
})

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/notes',notesRouter);
app.use('/api/pdf/',pdfRouter);
app.use('/api/credit',creditRouter);

app.listen(PORT, async (req,res)=>{
  console.log("Starting server, please wait");
  await connectDB();
  console.log(
  "Server is running on \x1b[34mhttps://localhost:8000\x1b[0m");
})