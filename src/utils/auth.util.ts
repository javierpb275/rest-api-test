import { Request } from "express";
import { IRequest } from "../types";

export class AuthUtil {
  public static castRequest = (req: Request): IRequest => {
    const request = req as unknown as IRequest;
    return request;
  };
}
