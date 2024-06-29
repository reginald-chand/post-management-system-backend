import Joi from "joi";

export const userObjectValidator = Joi.object({
  csrfToken: Joi.string(),

  userData: Joi.object().required(),
});
