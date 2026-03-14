import { createClient } from "redis";
import { env } from "../../../config/env";
import { winstonLogger } from "../../../config/logger";

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (err) => {
  winstonLogger.error(err)
});

export async function connectRedis(): Promise<void> {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    winstonLogger.error(error)
  }
}
