import { NextFunction, Response } from "express";
import { JWTLib } from "../libs";
import { IRequest } from "../types";

export class AuthMiddleware {
  public static JWT = async (
    req: IRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader: string | undefined = req.header("Authorization");

      if (!authHeader) {
        throw new Error();
      }

      const token: string = authHeader.split(" ")[1];

      if (!token) {
        throw new Error();
      }

      const payload = JWTLib.verifyAccessToken(token);

      req.userId = payload.id;

      next();
    } catch (err) {
      res.status(401).send({ error: "Please authenticate" });
    }
  };
}
