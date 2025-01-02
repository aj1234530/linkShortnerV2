import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "..";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET; //replace the jwt logic with jwt generate fxn
if (!JWT_SECRET) {
  throw new Error(`JWT_SECRET not found in .env`);
}
export const sigupController = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body; //add the zod validation here
    if (!username || !email || !password) {
      res.status(409).json({ message: "all field manadatory" });
      return;
    }
    //checking the unique username
    const usernameExists = await prisma.user.findFirst({ where: { username } });
    if (usernameExists) {
      res.status(409).json({ message: "username already taken, try another" });
      return;
    }
    //checking the unique email in db
    const emailExists = await prisma.user.findFirst({
      where: { email: email },
    });
    if (emailExists) {
      res
        .status(409)
        .json({ message: "this email already exist in our db please sign in" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username: username, email: email, password: hashedPassword },
    }); //creating acc in db
    const id = user.id;
    const token = jwt.sign({ id: id, username: user.username }, JWT_SECRET, {
      expiresIn: "48h",
    });
    res.status(200).json({
      message: "your are now signued up with us",
      token: token,
      username: username,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server error, retry a bit later" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; //add zod here
    if (!email || !password) {
      res.status(400).json({ message: "All fields are manadatory" });
      return;
    }
    const user = await prisma.user.findFirst({ where: { email } }); //c
    //checking user in db
    if (!user) {
      res
        .status(409)
        .json({ message: "you are not signed up , please sign up" });
      return;
    }
    //comparing the password with bcrypt
    if (!(await bcrypt.compare(password, user.password))) {
      res.status(404).json({ message: "Wrong Password, please retry" });
      return;
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "48h" }
    );
    res.status(200).json({
      message: "Login successful",
      token: token,
      username: user.username, //setting username for setting dynamic /ak1/dashboard(not tested yet)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//Todo - in frontend , show the message with the proper status code
