import { Router } from "express";
import { AuthMiddleware } from "../../../middlewares";
import { UserController } from "../controllers";

const UserRouter: Router = Router();

UserRouter.post(
  "/refresh",
  AuthMiddleware.JWT("refresh"),
  UserController.postRefresh
);
UserRouter.post(
  "/signout",
  AuthMiddleware.JWT("refresh"),
  UserController.postSignOut
);
UserRouter.post("/", UserController.postSignUp);
UserRouter.post("/signin", UserController.postSignIn);
UserRouter.get("/", AuthMiddleware.JWT("access"), UserController.getUsers);

export { UserRouter };

