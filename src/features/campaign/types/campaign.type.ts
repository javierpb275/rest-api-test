import mongoose from "mongoose";
import { IUser } from "../../user";

export type TCampaign = {
  name: string;
  user: string | IUser;
};

export interface ICampaign extends TCampaign, mongoose.Document {
  user: IUser;
}
