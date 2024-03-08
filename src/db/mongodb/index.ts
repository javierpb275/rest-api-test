import mongoose from "mongoose";
import { ApiConfig } from "../../config";

export class MongoDB {
  public static mongooseConnect = async (): Promise<void> => {
    try {
      const db = await mongoose.connect(ApiConfig.DB.URI + "/" + ApiConfig.DB.NAME);
      console.log(`Connected to database successfully!`);
    } catch (error) {
      console.log(`ERROR! Unable to connect to database!`);
    }
  };
}
