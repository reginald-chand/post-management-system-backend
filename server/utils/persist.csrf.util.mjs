import { logger } from "../configs/logger.config.mjs";
import { redisClient } from "../configs/redis.client.config.mjs";

/**
 * @description Create logged in users csrf token and relevant identifier information as a json object using Redis.
 * @param {string} csrfToken Generated CSRF Token per user session (1h)
 * @param {string} existingUserUserName UserName of the logged in user.
 * @param {string} existingUserEmail Email of the logged in user.
 */
export const persistCsrfUtil = async (
  csrfToken,
  existingUserUserName,
  existingUserEmail
) => {
  const hour = 3600;

  try {
    await redisClient.hSet(existingUserEmail, {
      csrfToken: csrfToken,
      userName: existingUserUserName,
    });

    redisClient.expire(existingUserEmail, hour, "NX");
  } catch (error) {
    logger.log({
      level: "error",
      message: error,
      additional: "Internal server error.",
    });
  }
};
