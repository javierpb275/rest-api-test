import {
    GraphQLError,
    GraphQLID,
    GraphQLObjectType,
    GraphQLScalarType,
    GraphQLString,
    GraphQLUnionType,
    Kind,
} from "graphql";

// Define an object type for string values
const GqlStringType = new GraphQLObjectType({
  name: "StringObject",
  fields: {
    value: { type: GraphQLString },
  },
});

// Define a scalar type for Date values
export const GqlDateType = new GraphQLScalarType({
  name: "DateTime",
  description: "ISO-8601 formatted date string",
  parseValue(value: any) {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format: " + value);
    }
    return date;
  },
  serialize(value: any) {
    if (!(value instanceof Date)) {
      throw new Error("DateTime cannot represent non-Date type");
    }
    return value.toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value);
      if (isNaN(date.getTime())) {
        throw new GraphQLError("Invalid date format", [ast]);
      }
      return date;
    }
    return null;
  },
});

// Define a scalar type for Number values
export const GqlNumberType = new GraphQLScalarType({
  name: "Number",
  description: "Int or Float scalar type",

  parseValue(value: any) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return Number.isInteger(value)
        ? parseInt(value.toString())
        : parseFloat(value.toString());
    }
    throw new Error("Invalid number format: " + value);
  },

  serialize(value: any) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return Number.isInteger(value)
        ? parseInt(value.toString())
        : parseFloat(value.toString());
    }
    throw new Error("Invalid number format: " + value);
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
      return parseFloat(ast.value);
    }
    throw new GraphQLError("Invalid number format", [ast]);
  },
});

// Define an object type for User
export const GqlUserType = new GraphQLObjectType({
  name: "User",
  description: "User object type",
  fields: () => ({
    _id: { type: GraphQLID },
    createdAt: { type: GqlDateType },
    updatedAt: { type: GqlDateType },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

// Define a union type for the user field
export const GqlUserOrStringType = new GraphQLUnionType({
  name: "UserOrString",
  description: "Union type for user field",
  types: [GqlUserType, GqlStringType],
  resolveType(value) {
    return typeof value === "object" ? "User" : "StringObject";
  },
});

// Define an object type for Campaign
export const GqlCampaignType = new GraphQLObjectType({
  name: "Campaign",
  description: "Campaign object type",
  fields: () => ({
    _id: { type: GraphQLID },
    createdAt: { type: GqlDateType },
    updatedAt: { type: GqlDateType },
    name: { type: GraphQLString },
    user: { type: GqlUserOrStringType },
  }),
});

// Define a union type for the campaign field
export const GqlCampaignOrStringType = new GraphQLUnionType({
  name: "CampaignOrString",
  description: "Union type for campaign field",
  types: [GqlCampaignType, GqlStringType],
  resolveType(value) {
    return typeof value === "object" ? "Campaign" : "StringObject";
  },
});
