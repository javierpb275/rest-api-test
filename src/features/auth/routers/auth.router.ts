import { Router } from "express";
import { AuthMiddleware } from "../../../middlewares";
import { AuthController } from "../controllers";

const AuthRouter: Router = Router();

AuthRouter.post(
  "/refresh",
  AuthMiddleware.JWT("refresh"),
  AuthController.postRefresh
);
AuthRouter.post(
  "/signout",
  AuthMiddleware.JWT("refresh"),
  AuthController.postSignOut
);
AuthRouter.post("/signup", AuthController.postSignUp);
AuthRouter.post("/signin", AuthController.postSignIn);
AuthRouter.get("/me", AuthMiddleware.JWT("access"), AuthController.getProfile);

export { AuthRouter };

