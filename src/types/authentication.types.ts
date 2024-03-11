import { Request } from "express";

export type TokenType = "access" | "refresh";

export interface IPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface IRequest extends Request {
  userId: string;
  token: string;
}
