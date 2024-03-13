import mongoose from "mongoose";
import { ICampaign } from "../types";

const campaignSchema = new mongoose.Schema<ICampaign>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

campaignSchema.set("toObject", { virtuals: true });
campaignSchema.set("toJSON", { virtuals: true });

campaignSchema.methods.toJSON = function () {
  const campaign = this;
  const campaignObject = campaign.toObject();
  delete campaignObject.__v;
  delete campaignObject.id;
  return campaignObject;
};

const CampaignModel = mongoose.model<ICampaign>("Campaign", campaignSchema);

export { CampaignModel };

