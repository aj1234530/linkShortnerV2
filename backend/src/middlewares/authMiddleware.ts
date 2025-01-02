import { Response, Request, NextFunction } from "express";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET; //replace the jwt logic with jwt generate fxn
if (!JWT_SECRET) {
  throw new Error(`JWT_SECRET not found in .env`);
}

export const authSessionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1]; //Was stuck here for 30 min cause of small a//if one of the properties in the chain is null or undefined if authobject dne then undefined else split
    if (!token) {
      res.status(401).json({ message: "Uauthorised" });
      return;
    }
    if (!JWT_SECRET) {
      throw new Error("internal server error");
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    //customt types added for the request in the global types
    req.userId = decoded.id;
    next();
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof Error && error.name === "TokenExpiredError") {
      //fixed using ai//error object is an instance of the JavaScript Error class. This ensures that the error is a proper error object.
      res.status(401).json({ message: "Access token has expired." });
      return;
    }
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid access token." });
      return;
    }
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};
