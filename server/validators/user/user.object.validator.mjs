import Joi from "joi";

export const userObjectValidator = Joi.object({
  _csrf: Joi.string(),

  userData: Joi.object().required(),
});
