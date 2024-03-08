import { Request } from "express";

export interface IPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface IRequest extends Request {
  userId: string;
}
