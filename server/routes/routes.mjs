import { csrfController } from "../controllers/auth/csrf.controller.mjs";
import express from "express";
import { parameterMiddleware } from "../middlewares/parameter.middleware.mjs";
import { postCreateController } from "../controllers/post/post.create.controller.mjs";
import { postDeleteController } from "../controllers/post/post.delete.controller.mjs";
import { postRetrieveBySlugController } from "../controllers/post/post.retrieve.by.slug.controller.mjs";
import { postRetrieveController } from "../controllers/post/post.retrieve.controller.mjs";
import { postUpdateController } from "../controllers/post/post.update.controller.mjs";
import { userVerificationMiddleware } from "../middlewares/user.verification.middleware.mjs";

export const routes = express.Router();

routes.post("/post/create", userVerificationMiddleware, postCreateController);

routes.put(
  "/post/:postSlug/update",
  userVerificationMiddleware,
  parameterMiddleware,
  postUpdateController
);

routes.delete(
  "/post/:postSlug/delete",
  userVerificationMiddleware,
  parameterMiddleware,
  postDeleteController
);

routes.get("/auth/csrf-token", csrfController);
routes.get("/all-posts", userVerificationMiddleware, postRetrieveController);

routes.get(
  "/post/:postSlug",
  userVerificationMiddleware,
  parameterMiddleware,
  postRetrieveBySlugController
);
