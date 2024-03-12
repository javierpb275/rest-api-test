import { PaginationOptions } from "../types";

export class PaginationUtil {
  public static getPaginationOptions = (query: any): PaginationOptions => {
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = query.skip ? Number(query.skip) : 0;
    const sort = query.sort ? query.sort : "-updatedAt";
    return { limit, skip, sort };
  };

  public static getMatch = (query: any): any => {
    const match: any = {};
    const keys: string[] = Object.keys(query);
    const filteredKeys: string[] = keys.filter((key) => {
      return key !== "sort" && key !== "skip" && key !== "limit";
    });
    filteredKeys.forEach((key) => {
      if (!isNaN(Number(query[key]))) {
        query[key] = Number(query[key]);
      } else if (query[key] === "true" || query[key] === "false") {
        if (query[key] === "true") {
          query[key] = true;
        } else {
          query[key] = false;
        }
      } else if (query[key] === "null") {
        query[key] = null;
      }
      // TODO: Review this method. If search writing just a number (ex: 1) this is not executed. And probably if write null or true/false it would not work either
      // SUGGESTIONS: Leave just match[key] = new RegExp(`.*${query[key]}.*`, "i"); and maybe it works with any property. Another check if key === search...
      if (typeof query[key] === "string") {
        match[key] = new RegExp(`.*${query[key]}.*`, "i");
      } else {
        match[key] = query[key];
      }
    });
    return match;
  };

  public static getFilteredMatch = (
    match: any,
    allowedProperties: string[]
  ) => {
    const filteredMatch: any = {};
    const filteredKeys: string[] = Object.keys(match).filter((key) =>
      allowedProperties.includes(key)
    );
    if (!filteredKeys.length) {
      return filteredMatch;
    }
    filteredKeys.forEach((key) => {
      filteredMatch[key] = match[key];
    });
    return filteredMatch;
  };
}
