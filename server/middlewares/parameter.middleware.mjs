import { logger } from "../configs/logger.config.mjs";
import { uriParamValidator } from "../validators/param/uri.param.validator.mjs";

export const parameterMiddleware = async (request, response, next) => {
  const { error } = uriParamValidator.validate(request.params);

  if (error) {
    return response.status(400).json({ responseMessage: error.message });
  }

  try {
    next();
  } catch (error) {
    logger.log({
      level: "error",
      message: error,
      additional: "Internal server error.",
    });

    return response.status(500).json({
      responseMessage: "Internal server error.",
    });
  }
};
