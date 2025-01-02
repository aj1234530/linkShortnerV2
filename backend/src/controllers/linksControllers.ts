import { Request, Response, urlencoded } from "express";
import { redisClient } from "../redisClient";
const BASE_URL = process.env.BASE_URL || "localhost";
import { PORT, prisma } from "..";
import { createUniqueRandomSlug } from "../utils/createShortLinks";
import { data } from "react-router-dom";

//this generator is incomplete
const uniqueSlugGenerator = (originalUrlFromBody: string) => {
  const originalUrlPrefixedWithHttpOrHttps =
    !originalUrlFromBody.startsWith("http://") &&
    !originalUrlFromBody.startsWith("https://")
      ? `http://${originalUrlFromBody}`
      : originalUrlFromBody;
  const shortenedUrlSlug = createUniqueRandomSlug();

  if (!shortenedUrlSlug) {
    //ensuring not returning null
    throw new Error("Internal server error");
  }
  return `${BASE_URL}:${PORT}/${shortenedUrlSlug}`;
};

export const createShortLinks = async (req: Request, res: Response) => {
  try {
    const originalUrlFromBody = req.body.originalUrlFromBody;
    console.log(originalUrlFromBody, typeof originalUrlFromBody);
    //using ternary operator to prefix with https if neither it starts with https nor with http
    const originalUrlPrefixedWithHttpOrHttps =
      !originalUrlFromBody.startsWith("http://") &&
      !originalUrlFromBody.startsWith("https://")
        ? `http://${originalUrlFromBody}`
        : originalUrlFromBody;
    const shortenedUrlSlug = createUniqueRandomSlug();

    if (!shortenedUrlSlug) {
      //ensuring not returning null
      throw new Error("Internal server error");
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } }); //finding the user
    //creaet the url in url table giving the id of user id it will be associated to that user(where nhi ata create me)
    const urlCreated = await prisma.url.create({
      data: {
        userId: req.userId,
        originalUrl: originalUrlPrefixedWithHttpOrHttps,
        shortenedUrlUniqueSlug: `${shortenedUrlSlug}`, //parsing to string as used Date.now() - only saving the unique slug
      },
    });
    const shortenedUrl = `${BASE_URL}:${PORT}/user/${shortenedUrlSlug}`; //composing the short url to return
    res
      .status(200)
      .json({ message: "URL CREATED", shortenedUrl: shortenedUrl });
    console.log(urlCreated); //debug
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

//this is incomplete (and has repeated logic of above fxn use uniquesluggenre)
export const createGuestShortLinks = async (req: Request, res: Response) => {
  const originalUrlFromBody: string = req.body.originalUrl;
  //using ternary operator to prefix with https if neither it starts with https nor with http
  const originalUrlPrefixedWithHttpOrHttps =
    !originalUrlFromBody.startsWith("http://") &&
    !originalUrlFromBody.startsWith("https://")
      ? `http://${originalUrlFromBody}`
      : originalUrlFromBody;
  const shortenedUrlSlug = createUniqueRandomSlug();

  if (!shortenedUrlSlug) {
    //ensuring not returning null
    throw new Error("Internal server error");
  }
  const shortenedUrl = `${BASE_URL}:${PORT}/${shortenedUrlSlug}`;
};
export const getoriginalLink = async (req: Request, res: Response) => {
  try {
    const { shortenedUrlUniqueSlug } = req.body; //expect the slug from frontend
    const originalUrlData = await prisma.url.findFirst({
      where: { shortenedUrlUniqueSlug: shortenedUrlUniqueSlug },
    });
    if (!originalUrlData) {
      res.status(404).json({ message: "Invalid address,url not found" });
      return;
    }
    //incrase count , //directly hitting db for now
    await prisma.url.update({
      where: { id: originalUrlData.id },
      data: { clicksCount: { increment: 1 } },
    });
    console.log(originalUrlData?.originalUrl);
    // res.redirect(301, originalUrlData?.originalUrl); //(redierct is behaving like api/v1/slugthat is sent ); need to figure outs
    res.status(200).json({ originalUrl: originalUrlData.originalUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error encountered" });
  }
};

export const getAllLinksOfAUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { urls: true },
    });
    const allLinks = user?.urls;
    res.status(200).json({ urlsArray: allLinks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
