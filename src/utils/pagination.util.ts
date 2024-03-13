import { PaginationOptions } from "../types";

export class PaginationUtil {
  public static getPaginationOptions = (query: any): PaginationOptions => {
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = query.skip ? Number(query.skip) : 0;
    const sort = query.sort ? query.sort : "-updatedAt";
    return { limit, skip, sort };
  };
}
