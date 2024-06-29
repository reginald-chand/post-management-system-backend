import { PostModel } from "../../models/post/post.model.mjs";
import { logger } from "../../configs/logger.config.mjs";
import { redisClient } from "../../configs/redis.client.config.mjs";
import { userObjectValidator } from "../../validators/user/user.object.validator.mjs";

export const postRetrieveBySlugController = async (request, response) => {
  const { error, value } = userObjectValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseMessage: error.message });
  }

  const { csrfToken, userData } = value;
  const { postSlug } = request.params;

  try {
    const userSession = await redisClient.hGetAll(userData.email);

    if (csrfToken !== userSession.csrfToken) {
      return response.status(401).json({ responseMessage: "UnAuthorized." });
    }

    const posts = await PostModel.find({
      $and: [{ userId: { $eq: userData.id } }, { postSlug: { $eq: postSlug } }],
    });

    const existingUser = await PostModel.exists({
      userId: { $eq: userData.id },
    });

    if (!existingUser) {
      return response.status(401).json({
        responseMessage: "UnAuthorized.",
      });
    }

    const existingPosts = await PostModel.exists({
      postSlug: { $eq: postSlug },
    });

    if (!existingPosts) {
      return response.status(404).json({
        responseMessage: "Post not found. Please try again!",
      });
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
