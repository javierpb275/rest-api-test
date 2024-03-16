import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql } from "graphql";
import { CreateOneParams, FindManyParams, ModelType } from "../types";
import { MongooseLib } from "./mongoose.lib";

type ModelProperties = {
  [key: string]: string; // Property name and its type
};

interface GetManyMethod extends FindManyParams {
  queryObject: any;
}

interface PostOneMethod extends CreateOneParams {
  queryObject: any;
}

interface GetQueryAndSchemaParams {
  model: ModelType;
  queryObject: any;
  isArray: boolean;
}

interface GqlApiCallParams extends GetQueryAndSchemaParams {
  resolvers: any;
}

export class GraphqlLib {
  public static getMany = async ({
    model,
    params,
    queryObject,
  }: GetManyMethod) => {
    try {
      const resolvers = GraphqlLib.getManyResolvers({ model, params });
      const { data, errors } = await GraphqlLib.apiCall({
        model,
        queryObject,
        isArray: true,
        resolvers,
      });
      return {
        data,
        errors,
      };
    } catch (error) {
      throw error;
    }
  };

  public static postOne = async ({
    model,
    body,
    queryObject,
  }: PostOneMethod) => {
    try {
      const resolvers = GraphqlLib.postOneResolvers({ model, body });
      const { data, errors } = await GraphqlLib.apiCall({
        model,
        queryObject,
        isArray: false,
        resolvers,
      });
      return {
        data,
        errors,
      };
    } catch (error) {
      throw error;
    }
  };

  private static apiCall = async ({
    isArray,
    model,
    queryObject,
    resolvers,
  }: GqlApiCallParams) => {
    const { query, schema } = GraphqlLib.getQueryAndSchema({
      model,
      queryObject,
      isArray,
    });
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
  };

  private static getQueryAndSchema = ({
    model,
    queryObject,
    isArray,
  }: GetQueryAndSchemaParams) => {
    const query = GraphqlLib.getQuery(model, queryObject);
    const schema = GraphqlLib.getSchema(model, isArray);
    return { query, schema };
  };

  private static getManyResolvers = ({ model, params }: FindManyParams) => {
    const resolvers = {
      Query: {
        data: async () => {
          try {
            return await MongooseLib.findMany({ model, params });
          } catch (error) {
            throw new Error(`Failed to fetch ${model.toLowerCase()}s`);
          }
        },
      },
    };
    return resolvers;
  };

  private static postOneResolvers = ({ model, body }: CreateOneParams) => {
    const resolvers = {
      Query: {
        data: async () => {
          try {
            return await MongooseLib.createOne({ model, body });
          } catch (error) {
            throw new Error(`Failed to create ${model}`);
          }
        },
      },
    };
    return resolvers;
  };

  private static getSchema = (model: string, isArray: boolean): string => {
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
