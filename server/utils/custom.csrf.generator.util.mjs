import { logger } from "../configs/logger.config.mjs";
import { randomBytes } from "crypto";

export const customCsrfGeneratorUtil = () => {
  try {
    const buffer = randomBytes(256);
    const csrfToken = buffer.toString("hex");

    return csrfToken;
  } catch (error) {
    logger.log({
      level: "error",
      message: error,
      additional: "Internal server error.",
    });
  }
};
