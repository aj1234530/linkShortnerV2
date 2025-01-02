import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient(); //prisma exported to be used in another modules
import cors from "cors";
import { authRouter } from "./routes/authRoutes";
import { linkRouter } from "./routes/linksRoutes";
import { authSessionMiddleware } from "./middlewares/authMiddleware";
const app = express();
export const PORT = process.env.PORT || 3001;
app.use(express.json());

app.use(cors());

app.get("/ping", (req, res) => {
  res.send("pong");
});

// basic middleware for logging every request , first request pass throught this and then to any other api below it (event auths one (why - as the before authMiddlware this middle is there))
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Body:", req.body);
  console.log("Headers:", req.headers);
  next();
});

app.get("/ping/ping", authSessionMiddleware, (req, res) => {
  res.send("pong pong");
});

app.use("/api/v1/auth", authRouter);

//catch all routes for , for invalid paths
app.use("/api/v1/user", linkRouter);
app.use(function (req, res) {
  res.status(400).json({ message: "Page Not Found" });
});
app.listen(PORT);
