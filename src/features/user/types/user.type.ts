import mongoose from "mongoose";

export type TUser = {
  search: string;
  username: string;
  email: string;
  password: string;
};

export interface IUser extends TUser, mongoose.Document {}
