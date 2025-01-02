import express, { Request, Response } from "express";
import {
  loginController,
  sigupController,
} from "../controllers/authControllers";
export const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

authRouter.post("/login", loginController);

authRouter.post("/signup", sigupController);
