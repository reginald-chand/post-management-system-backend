import { PostModel } from "../../models/post/post.model.mjs";
import { logger } from "../../configs/logger.config.mjs";
import { redisClient } from "../../configs/redis.client.config.mjs";
import { userObjectValidator } from "../../validators/user/user.object.validator.mjs";

export const postRetrieveController = async (request, response) => {
  const { error, value } = userObjectValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseMessage: error.message });
  }

  const { csrfToken, userData } = value;

  try {
    const userSession = await redisClient.hGetAll(userData.email);

    if (csrfToken !== userSession.csrfToken) {
      return response.status(401).json({ responseMessage: "UnAuthorized." });
    }

    const posts = await PostModel.find({ userId: { $eq: userData.id } });

    if (!posts) {
      return response.status(404).json({ responseMessage: "Post not found." });
    }

    return response.status(200).json({
      responseMessage: posts,
    });
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
