import { PaginationOptions } from "../types";

export class PaginationUtil {
  public static getPaginationOptions = (query: any): PaginationOptions => {
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = query.skip ? Number(query.skip) : 0;
    const sort = query.sort ? query.sort : "-updatedAt";
    return { limit, skip, sort };
  };

  private static createMatch = (query: any, keys: string[]): any => {
    const match: any = {};
    keys.forEach((key) => {
      if (key.startsWith("str_") || key === "search") {
        const str_ = key.replace(/^str_/, "");
        match[str_] = new RegExp(`.*${query[key]}.*`, "i");
      } else if (key.startsWith("num_") && !isNaN(Number(query[key]))) {
        const num_ = key.replace(/^num_/, "");
        match[num_] = Number(query[key]);
      } else if (key.startsWith("bool_")) {
        const bool_ = key.replace(/^bool_/, "");
        if (query[key].toLowerCase() === "true") {
          match[bool_] = true;
        } else if (query[key].toLowerCase() === "false") {
          match[bool_] = false;
        }
      } else if (
        key.startsWith("null_") &&
        query[key].toLowerCase() === "null"
      ) {
        const null_ = key.replace(/^null_/, "");
        match[null_] = null;
      } else if (
        key.startsWith("undef_") &&
        query[key].toLowerCase() === "undefined"
      ) {
        const undef_ = key.replace(/^undef_/, "");
        match[undef_] = undefined;
      } else {
        match[key] = query[key];
      }
    });
    return match;
  };

  public static getMatch = (query: any): any => {
    const keys: string[] = Object.keys(query);
    const filteredKeys: string[] = keys.filter((key) => {
      return key !== "sort" && key !== "skip" && key !== "limit";
    });
    const match = PaginationUtil.createMatch(query, filteredKeys);
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
