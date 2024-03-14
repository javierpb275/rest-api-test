import { Response } from "express";
import { IUser, UserModel } from "../features/user";
import { GraphqlLib, MongooseLib } from "../libs";
import { CrudParams, ModelType } from "../types";
import { AuthUtil } from "./auth.util";
import { FilterUtil } from "./filter.util";
import { PaginationUtil } from "./pagination.util";

type AddToBody = {
  userId?: string;
};

export class CrudUtil {
  private static extraSteps = (
    model: ModelType,
    method: "postOne",
    body?: any,
    addToBody?: AddToBody
  ) => {
    if (method === "postOne") {
      if (model === "Campaign") {
        body.user = addToBody?.userId;
      }
    }
  };
  public static getMany = async ({
    req,
    res,
    model,
    filter = [],
    hasAuth = false,
  }: CrudParams): Promise<Response> => {
    const { userId, query, headers } = AuthUtil.castRequest(req);
    let user: IUser | null = null;
    const { limit, skip, sort } = PaginationUtil.getPaginationOptions(
      headers,
      filter
    );
    const match = FilterUtil.getMatch(model, headers, filter);
    try {
      if (hasAuth) {
        user = await UserModel.findOne({ _id: userId });
        if (!user) {
          return res.status(404).send({ error: "User Not Found!" });
        }
      }
      /*
      const documents = await MongooseLib.findMany({
        model,
        params: { limit, match, skip, sort },
      });
      */
      //Pending fixing error with types of schema (dates are return as strings with a number)
      const { data } = await GraphqlLib.findMany({
        model,
        params: { limit, match, skip, sort },
        queryObject: query,
      });

      return res.status(200).send(data);
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  };
  public static postOne = async ({
    req,
    res,
    model,
    hasAuth = false,
  }: CrudParams): Promise<Response> => {
    const { userId, body } = AuthUtil.castRequest(req);
    let user: IUser | null = null;
    try {
      if (hasAuth) {
        user = await UserModel.findOne({ _id: userId });
        if (!user) {
          return res.status(404).send({ error: "User Not Found!" });
        }
      }
      this.extraSteps(model, "postOne", body, { userId: user?._id });
      const document = await MongooseLib.createOne({ model, body });
      return res.status(201).send(document);
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  };
}
