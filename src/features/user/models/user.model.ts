import mongoose from "mongoose";
import validator from "validator";
import { BcryptLib } from "../../../libs";
import { IUser } from "../types";

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value: string) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.__v;
  delete userObject.id;
  delete userObject.password;
  return userObject;
};

userSchema.pre<IUser>("save", async function (next) {
  const user: IUser = this;
  if (!user.isModified("password")) {
    return next();
  }
  const hash: string = await BcryptLib.hashPassword(user.password);
  user.password = hash;
  next();
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export { UserModel };

