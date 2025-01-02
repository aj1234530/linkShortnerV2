import express, { Request, Response } from "express";
import {
  createGuestShortLinks,
  createShortLinks,
  getAllLinksOfAUser,
  getoriginalLink,
} from "../controllers/linksControllers";
import { authSessionMiddleware } from "../middlewares/authMiddleware";
export const linkRouter = express.Router();

linkRouter.post("/accessoriginallink", getoriginalLink); //just returning the the original link anothing else
linkRouter.post("/guestuser/createshortlinks", createGuestShortLinks); //
linkRouter.post("/createshortlinks", authSessionMiddleware, createShortLinks); //this route will not work without middleware as it is ass with jwt
linkRouter.get("/links", authSessionMiddleware, getAllLinksOfAUser);
// linkRouter.post("/getoriginallink", getoriginalLink);//it is based on the frontend redirect using window.location.href

//testing res.reidrect without auth at /api/v1/user/redirect - works default status in inspect is 301
//note i use get request so that i can use this api in browser(what it means?)

//but how you will send this response to the frontend
linkRouter.get("/redirect", (req: Request, res: Response) => {
  res.redirect("https://www.chatgpt.com");
});
