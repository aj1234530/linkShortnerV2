import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient(); //prisma exported to be used in another modules
import cors from "cors";
import { authRouter } from "./routes/authRoutes";
import { linkRouter } from "./routes/linksRoutes";
import { authSessionMiddleware } from "./middlewares/authMiddleware";
import axios from "axios";
import { job } from "./utils/CronJobs/UpdateDB";
const app = express();
export const PORT = process.env.PORT || 3000;
console.log(PORT);
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

//middleware to log the request
app.use(async (req, res, next) => {
  // const ip = req.ip || req.connection.remoteAddress;//req.iq is express request body, req.connection.remoteAddress(part of node js http module)
  const ip = req.headers["x-forwarded-for"] || req.socket; //ngrok passes in headers

  // Skip local IP addresses
  if (ip === "::1" || ip === "127.0.0.1") {
    console.log("Local IP detected, skipping geolocation.");
    return next(); // Skip geolocation
  }

  console.log("Fetching geolocation data...");

  try {
    // Fetch location data from ip-api
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const data = response.data;

    if (data.status === "fail") {
      console.log("geolocation failed");
      // console.log("Geolocation failed for IP:", ip);
      return next();
    }

    // Log or use the location data
    console.log("User IP:", data.query);
    console.log("Country:", data.country);
    console.log("City:", data.city);

    // Attach geolocation data to request (extended the type)
    req.geoData = data;

    next(); // Proceed with the next middleware/route handler
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    res.status(500).json({ message: "Error fetching geolocation data" });
  }
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
//A global catch mechanism in Express.js ensures that any unhandled errors throughout your application are caught and handled gracefully.

app.listen(PORT);

//starting job
job.start();
