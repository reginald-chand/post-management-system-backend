import { csrfController } from "../controllers/auth/csrf.controller.mjs";
import express from "express";
import { parameterMiddleware } from "../middlewares/parameter.middleware.mjs";
import { postCreateController } from "../controllers/post/post.create.controller.mjs";
import { postDeleteController } from "../controllers/post/post.delete.controller.mjs";
import { postUpdateController } from "../controllers/post/post.update.controller.mjs";

export const routes = express.Router();

routes.post("/post/create", postCreateController);

routes.put("/post/:postSlug/update", parameterMiddleware, postUpdateController);

routes.delete(
  "/post/:postSlug/delete",
  parameterMiddleware,
  postDeleteController
);

routes.get("/auth/csrf-token", csrfController);
