import Joi from "joi";

export const uriParamValidator = Joi.object({
  postSlug: Joi.string()
    .pattern(new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$"))
    .required(),
});
