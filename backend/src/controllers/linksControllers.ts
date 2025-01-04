import { Request, Response, urlencoded } from "express";
import { redisClient } from "../redisClient";
const BASE_URL = process.env.BASE_URL || "localhost";
import { PORT, prisma } from "..";
import { createUniqueRandomSlug } from "../utils/createShortLinks";

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
interface reqBody {
  originalUrlFromBody: string;
  tags: string[];
  comments: string;
}
//redis returns the stings only
interface redisHgetallResponse {
  originalUrl: string;
  count: string;
  tags: string; //need to parse
  comments: string;
}

export const guestCreateShortLinks = async (req: Request, res: Response) => {
  try {
    const { originalUrlFromBody, tags, comments }: reqBody = req.body;
    const userId = req?.userId;

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
    //save to the redis

    // const user = await prisma.user.findUnique({ where: { id: req.userId } }); //finding the user
    const urlCreated = await redisClient.hSet(
      `${shortenedUrlSlug}:create:UrlInfo`,
      {
        userId: req?.userId || "no user id",
        originalUrl: originalUrlFromBody,
        clicksCount: 0,
        tags: JSON.stringify(tags) || "general",
        comments: comments || "no comments",
      }
    );
    await redisClient.hSet(`${shortenedUrlSlug}:urlInfo`, {
      originalUrl: originalUrlFromBody,
      clickCount: 0,
    });
    //creaet the url in url table giving the id of user id it will be associated to that user(where nhi ata create me)
    // const urlCreated = await prisma.url.create({
    //   data: {
    //     userId: req.userId,
    //     originalUrl: originalUrlPrefixedWithHttpOrHttps,
    //     shortenedUrlUniqueSlug: `${shortenedUrlSlug}`, //parsing to string as used Date.now() - only saving the unique slug
    //   },
    // });

    const shortenedUrl = `${BASE_URL}:5173/user/${shortenedUrlSlug}`; //composing the short url to return
    res
      .status(200)
      .json({ message: "URL CREATED", shortenedUrl: shortenedUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
export const authorisedCreateShortLinks = async (
  req: Request,
  res: Response
) => {
  try {
    const { originalUrlFromBody, tags, comments }: reqBody = req.body;
    const userId = req.userId;

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
    //save to the redis

    // const user = await prisma.user.findUnique({ where: { id: req.userId } }); //finding the user
    const urlCreated = await redisClient.hSet(
      `${shortenedUrlSlug}:create:UrlInfo`,
      {
        userId: req?.userId || "no user id",
        originalUrl: originalUrlFromBody,
        clicksCount: 0,
        tags: JSON.stringify(tags) || "general",
        comments: comments || "no comments",
      }
    );
    //creating to keep in redis for counter
    await redisClient.hSet(`${shortenedUrlSlug}:urlInfo`, {
      originalUrl: originalUrlFromBody,
      clicksCount: 0,
    });

    //creaet the url in url table giving the id of user id it will be associated to that user(where nhi ata create me)
    // const urlCreated = await prisma.url.create({
    //   data: {
    //     userId: req.userId,
    //     originalUrl: originalUrlPrefixedWithHttpOrHttps,
    //     shortenedUrlUniqueSlug: `${shortenedUrlSlug}`, //parsing to string as used Date.now() - only saving the unique slug
    //   },
    // });

    const shortenedUrl = `${BASE_URL}:5173/user/${shortenedUrlSlug}`; //composing the short url to return
    res
      .status(200)
      .json({ message: "URL CREATED", shortenedUrl: shortenedUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
export const getoriginalLink = async (req: Request, res: Response) => {
  try {
    const { shortenedUrlUniqueSlug } = req.body; //expect the slug from frontend
    console.log(req.geoData, "code is here");
    const clickMetaData = {
      country: req?.geoData?.country || "no meta data availabe",
      city: req?.geoData?.city || "no meta data availabe",
      time: Date.now(),
    };

    //fix type here
    // const originalUrlData = await prisma.url.findFirst({
    //   where: { shortenedUrlUniqueSlug: shortenedUrlUniqueSlug },
    // });
    // if (!originalUrlData) {
    //   res.status(404).json({ message: "Invalid address,url not found" });
    //   return;
    // }
    // //incrase count , //directly hitting db for now
    // await prisma.url.update({
    //   where: { id: originalUrlData.id },
    //   data: { clicksCount: { increment: 1 } },
    // });

    //TODO - give type to this data

    //1. get the origina url

    const originalUrl = await redisClient.HGET(
      `${shortenedUrlUniqueSlug}:urlInfo`,
      "originalUrl"
    );
    //can we do send the url
    if (!originalUrl) {
      res.status(404).json({ message: "the original url  can't be found" });
      return;
    }
    //2.increasing the count of the hash field
    const increasedCount = await redisClient.hIncrBy(
      `${shortenedUrlUniqueSlug}:urlInfo`,
      "clicksCount",
      1
    );

    //set the meta_data for the this click -- setting the metadata to that count
    const setClickMetaData = await redisClient.hSet(
      `${shortenedUrlUniqueSlug}:clickMetaData`,
      increasedCount,
      JSON.stringify(clickMetaData) || "no meta data available"
    );
    //set the metadata
    // res.redirect(301, originalUrlData?.originalUrl); //(redierct is behaving like api/v1/slugthat is sent ); need to figure outs
    res.status(200).json({ originalUrl: originalUrl });
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
