import { PostModel } from "../../models/post/post.model.mjs";
import { logger } from "../../configs/logger.config.mjs";
import { postCreateControllerValidator } from "../../validators/post/post.create.controller.validator.mjs";
import { redisClient } from "../../configs/redis.client.config.mjs";

export const postCreateController = async (request, response) => {
  const { error, value } = postCreateControllerValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseMessage: error.message });
  }

  const { postTitle, postContent, postAuthor, csrfToken, userData } = value;

  try {
    const userSession = await redisClient.hGetAll(userData.email);

    if (csrfToken !== userSession.csrfToken) {
      return response.status(401).json({ responseMessage: "UnAuthorized." });
    }

    const existingPosts = await PostModel.exists({
      userId: { $eq: userData.id },
      postTitle: { $eq: postTitle },
    });

    if (existingPosts) {
      return response.status(409).json({
        responseMessage:
          "Post already exists. Please choose a different title.",
      });
    }

    const currentDate = new Date().toDateString();
    const currentTime = new Date().toTimeString();

    const postInformation = {
      userId: userData.id,
      userName: userData.userName,
      postTitle,
      postSlug: postTitle,
      postContent,
      postAuthor,
      postDate: currentDate,
      postTime: currentTime,
    };

    await PostModel.create(postInformation);
    return response.status(201).json({
      responseMessage: `Post ${postTitle} has been successfully created on ${currentDate} at ${currentTime}.`,
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
