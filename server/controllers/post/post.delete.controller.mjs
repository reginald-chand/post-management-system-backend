import { PostModel } from "../../models/post/post.model.mjs";
import { logger } from "../../configs/logger.config.mjs";

export const postDeleteController = async (request, response) => {
  const { postSlug } = request.params;

  try {
    const existingPosts = await PostModel.exists({
      postSlug: { $eq: postSlug },
    });

    if (!existingPosts) {
      return response.status(404).json({
        responseMessage: "Post not found. Please try again!",
      });
    }

    const currentDate = new Date().toDateString();
    const currentTime = new Date().toTimeString();

    const deletedPost = await PostModel.findOneAndDelete({
      _id: existingPosts._id,
    });

    return response.status(200).json({
      responseMessage: `Post ${deletedPost.postTitle} has been successfully deleted on ${currentDate} at ${currentTime}.`,
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
