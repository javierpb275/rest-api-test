import { Router } from "express";
import { AuthMiddleware } from "../../../middlewares";
import { UserController } from "../controllers";

const UserRouter: Router = Router();

UserRouter.get("/", AuthMiddleware.JWT("access"), UserController.getUsers);

export { UserRouter };

