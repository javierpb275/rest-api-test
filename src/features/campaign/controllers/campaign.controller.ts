import { Request, Response } from "express";
import { CrudUtil } from "../../../utils";

export class CampaignController {
  // GET CAMPAIGNS
  public static getCampaigns = async (
    req: Request,
    res: Response
  ): Promise<Response> => CrudUtil.getMany({ req, res, model: "Campaign" });
  // CREATE CAMPAIGN
  public static postCampaign = async (
    req: Request,
    res: Response
  ): Promise<Response> =>
    CrudUtil.postOne({ req, res, model: "Campaign", hasAuth: true });
}
