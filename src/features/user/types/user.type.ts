import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  search: string;
  username: string;
  email: string;
  password: string;
}
