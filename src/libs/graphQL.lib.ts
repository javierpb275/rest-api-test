import {
    GraphQLError,
    GraphQLScalarType,
    GraphQLSchema,
    Kind,
    buildSchema,
    graphql,
} from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { FindManyParams } from "../types";
import { MongooseLib } from "./mongoose.lib";

type ModelProperties = {
  [key: string]: string; // Property name and its type
};

interface FindManyMethod extends FindManyParams {
  queryObject: any;
}

export class GraphqlLib {
  public static findMany = async ({
    model,
    params,
    queryObject,
  }: FindManyMethod) => {
    try {
      const query = GraphqlLib.getFindManyQuery(model, queryObject);
      const schema = GraphqlLib.getFindManySchema(model);
      const resolvers = GraphqlLib.getFindManyResolvers({ model, params });

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

  private static getFindManyResolvers = ({ model, params }: FindManyParams) => {
    const resolvers = {
      Query: {
        [model.toLowerCase() + "s"]: async () => {
          try {
            return await MongooseLib.findMany({ model, params });
          } catch (error) {
            throw new Error(`Failed to fetch ${model.toLowerCase() + "s"}`);
          }
        },
      },
    };
    return resolvers;
  };

  private static getFindManySchema = (model: string): GraphQLSchema => {
    try {
      let schema = GraphqlLib.chooseSchema(model);
      const schemaString = `
      type ${model} {
        ${Object.entries(schema)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")}
      }

      type Query {
        ${model.toLowerCase()}s(${GraphqlLib.formatSchema(
        schema
      )}): [${model}!]!
      }
    `;
      return buildSchema(schemaString);
    } catch (error) {
      throw error;
    }
  };

  private static getFindManyQuery = (
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
        ${model.toLowerCase()}s {
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

  private static ObjectType = new GraphQLScalarType({
    name: "Object",
    description: "Custom scalar type representing an object",

    parseValue(value: any) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        return value;
      }
      throw new Error("Invalid object format");
    },

    serialize(value: any) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        return value;
      }
      throw new Error("Invalid object format");
    },

    parseLiteral(ast: any) {
      if (ast.kind === Kind.OBJECT) {
        return ast.value;
      }
      throw new GraphQLError("Invalid object format", [ast]);
    },
  });

  private static DateType = new GraphQLScalarType({
    name: "DateTime",
    description: "ISO-8601 formatted date string",
    parseValue(value: any) {
      // Parse value from the client
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      return date;
    },
    serialize(value: any) {
      // Serialize value to send to the client
      if (!(value instanceof Date)) {
        throw new Error("DateTime cannot represent non-Date type");
      }
      return value.toISOString();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        // Parse date string from AST
        const date = new Date(ast.value);
        if (isNaN(date.getTime())) {
          throw new GraphQLError("Invalid date format", [ast]);
        }
        return date;
      }
      return null; // Invalid AST
    },
  });

  private static NumberType = new GraphQLScalarType({
    name: "Number",
    description: "Int or Float scalar type",

    parseValue(value: any) {
      if (typeof value === "number" && Number.isFinite(value)) {
        return Number.isInteger(value)
          ? parseInt(value.toString())
          : parseFloat(value.toString());
      }
      throw new Error("Invalid number format");
    },

    serialize(value: any) {
      if (typeof value === "number" && Number.isFinite(value)) {
        return Number.isInteger(value)
          ? parseInt(value.toString())
          : parseFloat(value.toString());
      }
      throw new Error("Invalid number format");
    },

    parseLiteral(ast) {
      if (ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
        return parseFloat(ast.value);
      }
      throw new GraphQLError("Invalid number format", [ast]);
    },
  });

  private static chooseSchema = (model: string): any => {
    let schema = {};
    if (model === "User") {
      schema = GraphqlLib.USER_SCHEMA;
    } else if (model === "Campaign") {
      schema = GraphqlLib.CAMPAIGN_SCHEMA;
    }
    return schema;
  };

  // PENDING FINDING OUT HOW TO CREATE TYPES (a data type for createdAt for example)
  private static DEFAULT_SCHEMA = {
    _id: "ID",
    createdAt: "String",
    updatedAt: "String",
  };

  private static USER_SCHEMA = {
    ...GraphqlLib.DEFAULT_SCHEMA,
    username: "String",
    email: "String",
  };
  private static CAMPAIGN_SCHEMA = {
    ...GraphqlLib.DEFAULT_SCHEMA,
    name: "String",
    user: "String",
  };
}
