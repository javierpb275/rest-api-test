import { Router } from "express";
import { AuthMiddleware } from "../../../middlewares";
import { UserController } from "../controllers";

const UserRouter: Router = Router();

UserRouter.post(
  "/refresh",
  AuthMiddleware.JWT("refresh"),
  UserController.refreshToken
);
UserRouter.post(
  "/signout",
  AuthMiddleware.JWT("refresh"),
  UserController.signOut
);
UserRouter.post("/", UserController.signUp);
UserRouter.post("/signin", UserController.signIn);
UserRouter.get("/", AuthMiddleware.JWT("access"), UserController.getUsers);

export { UserRouter };

