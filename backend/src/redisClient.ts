import { createClient } from "redis";
export const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));
//async way to connect to redis
async function connectRedis() {
  await redisClient
    .connect()
    .then(() => console.log("coonected"))
    .catch((err) => console.log(err));
}

connectRedis();
//even if the redis is down our backend will work , it will keep retrying to connect to the redis
