export class ApiConfig {
  public static DB = {
    URI: process.env.MONGODB_URI ?? "",
    USER: process.env.MONGODB_USER ?? "",
    PASSWORD: process.env.MONGODB_PASSWORD ?? "",
    NAME: process.env.MONGODB_NAME ?? "",
  };
  public static AUTH = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ?? "",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ?? "",
    ACCESS_TOKEN_EXPIRATION: "1h",
    REFRESH_TOKEN_EXPIRATION: "30d",
  };
}
