import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql } from "graphql";
import { FindManyParams } from "../types";
import { MongooseLib } from "./mongoose.lib";

type ModelProperties = {
  [key: string]: string; // Property name and its type
};

interface GetDataMethod extends FindManyParams {
  queryObject: any;
}

type ApiCallMethod =
  | "getOne"
  | "getMany"
  | "postOne"
  | "postMany"
  | "patchOne"
  | "patchMany"
  | "putOne"
  | "putMany"
  | "deleteOne"
  | "deleteMany";

export class GraphqlLib {
  public static getData = async ({
    model,
    params,
    queryObject,
  }: GetDataMethod) => {
    try {
      const query = GraphqlLib.getQuery(model, queryObject);
      const schema = GraphqlLib.getSchema(model);
      const resolvers = GraphqlLib.getResolvers({ model, params });

      const schemaWithResolvers = makeExecutableSchema({
        typeDefs: schema,
        resolvers,
      });

      const { data, errors } = await graphql({
        schema: schemaWithResolvers,
        source: query,
      });
      return {
        data,
        errors,
      };
    } catch (error) {
      throw error;
    }
  };

  private static getResolvers = (
    { model, params }: FindManyParams,
    method: ApiCallMethod = "getMany"
  ) => {
    const resolvers = {
      Query: {
        data: async () => {
          if (method === "getMany") {
            try {
              return await MongooseLib.findMany({ model, params });
            } catch (error) {
              throw new Error(`Failed to fetch data`);
            }
          }
        },
      },
    };
    return resolvers;
  };

  private static getSchema = (
    model: string,
    isArray: boolean = true
  ): string => {
    try {
      let schema = GraphqlLib.chooseSchema(model);
      const returnType = isArray ? `[${model}!]!` : `${model}!`;
      const schemaString = `
        scalar DateTime
        
        type ${model} {
          ${Object.entries(schema)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")}
        }

        type Query {
          data(${GraphqlLib.formatSchema(schema)}): ${returnType}
        }
      `;
      return schemaString;
    } catch (error) {
      throw error;
    }
  };

  private static getQuery = (
    model: string,
    queryObject: ModelProperties
  ): string => {
    let keys = Object.keys(queryObject);
    if (keys.length === 0) {
      keys = Object.keys(GraphqlLib.chooseSchema(model));
    }
    const fields = keys.join("\n");
    return `
      query {
        data {
          ${fields}
        }
      }
    `;
  };

  private static formatSchema = (schema: ModelProperties): string => {
    // Format query parameters to GraphQL query syntax
    return Object.entries(schema)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  private static chooseSchema = (model: string): ModelProperties => {
    let schema: ModelProperties = {};
    if (model === "User") {
      schema = GraphqlLib.USER_SCHEMA;
    } else if (model === "Campaign") {
      schema = GraphqlLib.CAMPAIGN_SCHEMA;
    }
    return schema;
  };

  private static DEFAULT_SCHEMA: ModelProperties = {
    _id: "ID",
    createdAt: "DateTime",
    updatedAt: "DateTime",
  };

  private static USER_SCHEMA: ModelProperties = {
    ...GraphqlLib.DEFAULT_SCHEMA,
    username: "String",
    email: "String",
  };
  private static CAMPAIGN_SCHEMA: ModelProperties = {
    ...GraphqlLib.DEFAULT_SCHEMA,
    name: "String",
    user: "ID",
  };
}
