import { Request, Response } from "express";
import { CrudUtil } from "../../../utils";

export class UserController {
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
      filter: [
        "sort",
        "skip",
        "limit",
        "username",
        "email",
        "search",
        "_id",
        "createdAt",
        "updatedAt",
      ],
    });
}
