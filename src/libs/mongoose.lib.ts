import { CampaignModel, ICampaign } from "../features/campaign";
import { IUser, UserModel } from "../features/user";
import { CreateOneParams, FindManyParams } from "../types";

type ReturnMany = IUser[] | ICampaign[];
type ReturnOne = IUser | ICampaign;

export class MongooseLib {
  public static createOne = async ({
    model,
    body,
  }: CreateOneParams): Promise<ReturnOne> => {
    try {
      if (model === "User") {
        const newUser: IUser = new UserModel(body);
        await newUser.save();
        return newUser;
      } else if (model === "Campaign") {
        const newCampaign: ICampaign = new CampaignModel(body);
        await newCampaign.save();
        return newCampaign;
      } else {
        throw new Error("Invalid model name");
      }
    } catch (error) {
      throw error;
    }
  };
  public static findMany = async ({
    model,
    params,
  }: FindManyParams): Promise<ReturnMany> => {
    try {
      if (model === "User") {
        const allUsers = await UserModel.find(params.match)
          .sort(params.sort)
          .skip(params.skip)
          .limit(params.limit);
        return allUsers;
      } else if (model === "Campaign") {
        const allCampaigns = await CampaignModel.find(params.match)
          .sort(params.sort)
          .skip(params.skip)
          .limit(params.limit);
        return allCampaigns;
      } else {
        throw new Error("Invalid model name");
      }
    } catch (error) {
      throw error;
    }
  };
}
