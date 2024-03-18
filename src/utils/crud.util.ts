import { Response } from "express";
import { IUser, UserModel } from "../features/user";
import { GraphqlLib } from "../libs";
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
      const { data } = await GraphqlLib.getMany({
        model,
        params: { limit, match, skip, sort },
        queryObject: query,
      });
      const result = data as any;
      return res.status(200).send({
        data: result.data,
        message: `Got ${
          result.data.length
        } ${model.toLowerCase()}s successfully`,
        status: 200,
      });
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
    const { userId, body, query } = AuthUtil.castRequest(req);
    let user: IUser | null = null;
    try {
      if (hasAuth) {
        user = await UserModel.findOne({ _id: userId });
        if (!user) {
          return res.status(404).send({ error: "User Not Found!" });
        }
      }
      this.extraSteps(model, "postOne", body, { userId: user?._id });
      const { data } = await GraphqlLib.postOne({
        model,
        body,
        queryObject: query,
      });
      const result = data as any;
      return res.status(201).send({
        data: result.data,
        message: `${model} created successfully`,
        status: 201,
      });
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  };
}
