import { Router } from "express";
import { AuthMiddleware } from "../../../middlewares";
import { CampaignController } from "../controllers";

const CampaignRouter: Router = Router();

CampaignRouter.get(
  "/",
  AuthMiddleware.JWT("access"),
  CampaignController.getCampaigns
);
CampaignRouter.post(
  "/",
  AuthMiddleware.JWT("access"),
  CampaignController.postCampaign
);

export { CampaignRouter };

