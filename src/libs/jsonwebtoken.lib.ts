import jwt from "jsonwebtoken";
import { ApiConfig } from "../config";
import { IPayload } from "../types";

export class JWTLib {
  public static generateToken = (
    userId: string,
    secret: string,
    expiration: string
  ): string => {
    const token: string = jwt.sign({ id: userId }, secret, {
      expiresIn: expiration,
    });
    return token;
  };

  public static createAccessToken = (userId: string): string => {
    const token = JWTLib.generateToken(
      userId,
      ApiConfig.AUTH.ACCESS_TOKEN_SECRET,
      ApiConfig.AUTH.ACCESS_TOKEN_EXPIRATION
    );
    return token;
  };

  public static createRefreshToken = (userId: string): string => {
    const token = JWTLib.generateToken(
      userId,
      ApiConfig.AUTH.REFRESH_TOKEN_SECRET,
      ApiConfig.AUTH.REFRESH_TOKEN_EXPIRATION
    );
    return token;
  };

  public static verify = (token: string, secret: string): IPayload => {
    const payload = jwt.verify(token, secret) as IPayload;
    return payload;
  };

  public static verifyAccessToken = (token: string): IPayload => {
    const payload = JWTLib.verify(token, ApiConfig.AUTH.ACCESS_TOKEN_SECRET);
    return payload;
  };

  public static verifyRefreshToken = (token: string): IPayload => {
    const payload = JWTLib.verify(token, ApiConfig.AUTH.REFRESH_TOKEN_SECRET);
    return payload;
  };
}
