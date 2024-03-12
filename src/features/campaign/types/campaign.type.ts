import mongoose from "mongoose";
import { IUser } from "../../user";

export interface ICampaign extends mongoose.Document {
  search: string;
  name: string;
  user: IUser;
}
