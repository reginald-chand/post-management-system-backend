import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    postTitle: { type: String, required: true, unique: true },
    postSlug: { type: String, required: true, unique: true },
    postContent: { type: String, required: true },
    postAuthor: { type: String, required: true },
    postDate: { type: String, required: true },
    postTime: { type: String, required: true },
  },
  { timestamps: true }
);

postSchema.pre("save", async function (next) {
  try {
    this.postSlug = slugify(this.postTitle, { lower: true, strict: true });
    next();
  } catch (error) {
    next(error);
  }
});

export const PostModel = mongoose.model("post", postSchema);
