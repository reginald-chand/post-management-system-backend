import Joi from "joi";

export const postCreateControllerValidator = Joi.object({
  csrfToken: Joi.string().required(),

  postTitle: Joi.string().pattern(new RegExp("^[A-Z].*$")).required(),
  postContent: Joi.string().required(),
  postAuthor: Joi.string().pattern(new RegExp("^[A-Z].*$")).required(),

  userData: Joi.object().required(),
});
