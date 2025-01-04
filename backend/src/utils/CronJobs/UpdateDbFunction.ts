import { redisClient } from "../../redisClient";
import { prisma } from "../..";
import { job } from "./UpdateDB";
interface data {
  userId: string;
  originalUrl: string;
  tags: string;
  comments: string;
}

export async function syncRedisToDB() {
  try {
    console.log("starting the sync process, code is here 1");
    const keys = await redisClient.keys("*:create:UrlInfo");
    console.log(keys); //itna keys hai

    keys.map(async (key) => {
      const data = await redisClient.hGetAll(key);
      console.log(
        "code is here 2 :",
        data,
        data.originalUrl,
        key.split(":")[0]
      );
      try {
        if (data.userId !== "no user id") {
          const createdUrl = await prisma.url.create({
            data: {
              shortenedUrlUniqueSlug: key.split(":")[0],
              userId: data.userId,
              originalUrl: data.originalUrl,
              clicksCount: parseInt(data.clicksCount),
              tags: data.tags.slice(2, data.tags.length - 2).split(","),
              comments: data.comments,
            },
          });
          redisClient.del(key);
        } else {
          const createdUrl = await prisma.url.create({
            data: {
              shortenedUrlUniqueSlug: key.split(":")[0],
              originalUrl: data.originalUrl,
              clicksCount: parseInt(data.clicksCount),
              tags: data.tags.split(","),
              comments: data.comments,
            },
          });
          redisClient.del(key);
        }
      } catch (error) {
        console.log(error);
      }
    });
    const couterKeys = await redisClient.keys("*:clickMetaData");

    couterKeys.map(async (counterKey) => {
      const data = await redisClient.hGetAll(counterKey);
      console.log(data);
    });

    console.log("code is here", couterKeys);
  } catch (error) {
    console.log(error);
  }
}
