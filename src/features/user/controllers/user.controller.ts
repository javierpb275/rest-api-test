import { Request, Response } from "express";
import { BcryptLib, JWTLib } from "../../../libs";
import { AuthUtil, CrudUtil } from "../../../utils";
import { UserModel } from "../models";
import { IUser } from "../types";

// TODO: Move methods related to authentication to an AuthController.

let refreshTokens: string[] = [];

export class UserController {
  // REFESH TOKEN
  public static postRefresh = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { userId, token } = AuthUtil.castRequest(req);
    try {
      if (!token) {
        return res.status(400).send({ error: "Please, provide refresh token" });
      }
      if (!refreshTokens.includes(token)) {
        return res.status(400).send({ error: "Refresh Token Invalid" });
      }
      refreshTokens = refreshTokens.filter((reToken) => reToken != token);
      const accessToken: string = JWTLib.createAccessToken(userId);
      const refreshToken: string = JWTLib.createRefreshToken(userId);
      refreshTokens.push(refreshToken);
      return res.status(200).send({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  };

  // SIGN OUT:
  public static postSignOut = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { token } = AuthUtil.castRequest(req);
    if (!token) {
      return res.status(400).send({ error: "Please, provide refresh token" });
    }
    if (!refreshTokens.includes(token)) {
      return res.status(400).send({ error: "Refresh Token Invalid" });
    }
    try {
      refreshTokens = refreshTokens.filter((reToken) => reToken != token);
      return res.status(200).send({ message: "Signed out successfully" });
    } catch (err) {
      return res.status(500).send({ error: "Unable to sign out" });
    }
  };

  // SIGN UP:
  public static postSignUp = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const newUser: IUser = new UserModel(req.body);
    try {
      const foundUser: IUser | null = await UserModel.findOne({
        email: req.body.email,
      });
      if (foundUser) {
        return res.status(400).send({ error: "Wrong email. Try again" });
      }
      const accessToken: string = JWTLib.createAccessToken(
        newUser._id.toString()
      );
      const refreshToken: string = JWTLib.createRefreshToken(
        newUser._id.toString()
      );
      refreshTokens.push(refreshToken);
      await newUser.save();
      return res.status(201).send({
        user: newUser,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  };

  // SIGN IN
  public static postSignIn = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .send({ error: "Please, send your email and password" });
    }
    try {
      const foundUser: IUser | null = await UserModel.findOne({
        email: req.body.email,
      });
      if (!foundUser) {
        return res.status(400).send({ error: "Wrong credentials" });
      }
      const isMatch: boolean = await BcryptLib.comparePassword(
        req.body.password,
        foundUser.password
      );
      if (!isMatch) {
        return res.status(400).send({ error: "Wrong credentials" });
      }
      const accessToken: string = JWTLib.createAccessToken(
        foundUser._id.toString()
      );
      const refreshToken: string = JWTLib.createRefreshToken(
        foundUser._id.toString()
      );
      refreshTokens.push(refreshToken);
      return res.status(200).send({
        user: foundUser,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      return res.status(400).send({ error: "Unable to sign in" });
    }
  };

  // GET USERS
  public static getUsers = async (
    req: Request,
    res: Response
  ): Promise<Response> =>
    CrudUtil.getMany({
      req,
      res,
      model: "User",
      hasAuth: true,
      filter: ["username", "email", "search", "_id", "createdAt", "updatedAt"],
    });
}
