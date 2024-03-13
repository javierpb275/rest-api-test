import { NextFunction, Request, Response } from "express";
import { JWTLib } from "../libs";
import { IRequest, TokenType } from "../types";

export class AuthMiddleware {
  public static JWT =
    (tokenType: TokenType) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const authHeader: string | undefined = req.header("Authorization");
        if (!authHeader) {
          throw new Error();
        }
        const token: string = authHeader.split(" ")[1];
        if (!token) {
          throw new Error();
        }
        const payload =
          tokenType === "access"
            ? JWTLib.verifyAccessToken(token)
            : JWTLib.verifyRefreshToken(token);

        (req as IRequest).token = token;
        (req as IRequest).userId = payload.id;
        next();
      } catch (err) {
        res.status(401).send({ error: "Please authenticate" });
      }
    };
}
