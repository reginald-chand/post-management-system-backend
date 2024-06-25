import { PostModel } from "../../models/post/post.model.mjs";
import { logger } from "../../configs/logger.config.mjs";
import { postCreateControllerValidator } from "../../validators/post/post.create.controller.validator.mjs";
import slugify from "slugify";

export const postUpdateController = async (request, response) => {
  const { error, value } = postCreateControllerValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseMessage: error.message });
  }

  const { postTitle, postContent, postAuthor, userData } = value;
  const { postSlug } = request.params;

  try {
    const existingPosts = await PostModel.exists({
      userId: { $eq: userData.id },
      postSlug: { $eq: postSlug },
    });

    if (!existingPosts) {
      return response.status(404).json({
        responseMessage: "Post not found. Please try again!",
      });
    }

    const currentDate = new Date().toDateString();
    const currentTime = new Date().toTimeString();

    const newPostSlug = slugify(postTitle, {
      lower: true,
      strict: true,
    });

    const postInformation = {
      $set: {
        postTitle,
        postSlug: newPostSlug,
        postContent,
        postAuthor,
        postDate: currentDate,
        postTime: currentTime,
      },
    };

    await PostModel.findOneAndUpdate(
      { _id: existingPosts._id },
      postInformation,
      { new: true, upsert: true }
    );

    return response.status(200).json({
      responseMessage: `Post ${postTitle} has been successfully updated on ${currentDate} at ${currentTime}.`,
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
