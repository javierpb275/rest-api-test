import { ModelType } from "../types";

// PENDING HANDLING ERRORS IN SET METHODS WHEN THE TYPES PASSED ARE NOT THE SAME AS EXPECTED...
export class FilterUtil {
  private static filterPagination = (allowedProperties: string[]): string[] => {
    const filteredKeys: string[] = allowedProperties.filter((key) => {
      return key !== "sort" && key !== "skip" && key !== "limit";
    });
    return filteredKeys;
  };

  public static getFilteredHeaders = (
    headers: any,
    allowedProperties: string[]
  ) => {
    const filteredHeaders: any = {};
    const filteredKeys: string[] = Object.keys(headers).filter((key) =>
      allowedProperties.includes(key)
    );
    if (!filteredKeys.length) {
      return filteredHeaders;
    }
    filteredKeys.forEach((key) => {
      filteredHeaders[key] = headers[key];
    });
    return filteredHeaders;
  };

  private static setSearch = (match: any, headers: any) => {
    if ("search" in headers) {
      const searchValue = headers["search"];
      // Match against multiple fields
      match["$or"] = [
        { username: new RegExp(`.*${searchValue}.*`, "i") },
        { email: new RegExp(`.*${searchValue}.*`, "i") },
        { name: new RegExp(`.*${searchValue}.*`, "i") },
      ];
      // Remove search key to avoid processing it as a regular field
      delete headers["search"];
    }
  };

  private static setDefaultValues = (match: any, headers: any): void => {
    const keys: string[] = Object.keys(headers);
    keys.forEach((key) => {
      if (key === "createdAt" || key === "updatedAt") {
        match[key] = new Date(headers[key]);
      } else if (key === "__v") {
        match[key] = Number(headers[key]);
      } else {
        match[key] = headers[key];
      }
    });
  };

  private static setUserValues = (match: any, headers: any): void => {
    const keys: string[] = Object.keys(headers);
    keys.forEach((key) => {
      if (key === "username" || key === "email") {
        match[key] = new RegExp(`.*${headers[key]}.*`, "i");
      } else {
        match[key] = headers[key];
      }
    });
  };

  private static setCampaignValues = (match: any, headers: any): void => {
    const keys: string[] = Object.keys(headers);
    keys.forEach((key) => {
      if (key === "name") {
        match[key] = new RegExp(`.*${headers[key]}.*`, "i");
      } else {
        match[key] = headers[key];
      }
    });
  };

  public static getMatch = (
    model: ModelType,
    headers: any,
    allowedProperties: string[]
  ) => {
    const filteredPagination = this.filterPagination(allowedProperties);
    const filteredHeaders = this.getFilteredHeaders(
      headers,
      filteredPagination
    );
    const match: any = {};
    this.setSearch(match, filteredHeaders);
    this.setDefaultValues(match, filteredHeaders);
    if (model === "User") {
      this.setUserValues(match, filteredHeaders);
    } else if (model === "Campaign") {
      this.setCampaignValues(match, filteredHeaders);
    } else {
      throw Error("Incorrect model");
    }

    return match;
  };
}
