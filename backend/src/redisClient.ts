import { createClient } from "redis";
export const redisClient = createClient({
  url: "rediss://default:AbAmAAIjcDEwZmEwMWJiOGRhYmI0NWIwOGZmMjIwNzQ1MWMzZDZkNHAxMA@pumped-tetra-45094.upstash.io:6379",
});
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
