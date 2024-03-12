import { Request, Response } from "express";

export type ModelType = "User" | "Campaign";

interface DefaultParams {
  model: ModelType;
}

export interface CrudParams extends DefaultParams {
  req: Request;
  res: Response;
  hasAuth?: boolean
}

export interface PaginationParams {
  match: any;
  skip: number;
  limit: number;
  sort: string;
}

export interface FindManyParams extends DefaultParams {
  params: PaginationParams;
}

export interface CreateOneParams extends DefaultParams {
  body: any;
}
