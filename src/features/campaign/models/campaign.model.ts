import mongoose from "mongoose";
import { ICampaign } from "../types";

const campaignSchema = new mongoose.Schema<ICampaign>(
  {
    search: {
      type: String,
      lowercase: true,
    },
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
  delete campaignObject._id;
  delete campaignObject.search;
  return campaignObject;
};

campaignSchema.pre<ICampaign>("save", async function (next) {
  const campaign: ICampaign = this;
  campaign.search = `${campaign.name}`.toLowerCase();
  next();
});

const CampaignModel = mongoose.model<ICampaign>("Campaign", campaignSchema);

export { CampaignModel };

