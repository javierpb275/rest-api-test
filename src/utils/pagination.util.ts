import { PaginationOptions } from "../types";
import { FilterUtil } from "./filter.util";

// PENDING HANDLING ERRORS WHEN THE TYPES PASSED ARE NOT THE SAME AS EXPECTED...
export class PaginationUtil {
  public static getPaginationOptions = (
    headers: any,
    allowedProperties: string[]
  ): PaginationOptions => {
    const filteredHeaders = FilterUtil.getFilteredHeaders(
      headers,
      allowedProperties
    );
    const limit = filteredHeaders.limit ? Number(filteredHeaders.limit) : 10;
    const skip = filteredHeaders.skip ? Number(filteredHeaders.skip) : 0;
    const sort = filteredHeaders.sort ? filteredHeaders.sort : "-updatedAt";
    return { limit, skip, sort };
  };
}
