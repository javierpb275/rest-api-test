import mongoose from "mongoose";

export type TUser = {
  username: string;
  email: string;
  password: string;
};

export interface IUser extends TUser, mongoose.Document {}
