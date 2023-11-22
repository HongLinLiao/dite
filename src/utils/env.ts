import path from "path";
import * as dotenv from "dotenv";

const NODE_ENV = process.env.NODE_ENV;
dotenv.config({
  path: NODE_ENV
    ? path.resolve(__dirname, `../../.env.${NODE_ENV}`)
    : path.resolve(__dirname, "../../.env"),
});

const env: Env = {
  environment: process.env.ENV as Environment,
  port: process.env.PORT || "3000",
  mongoConnection: process.env.MONGO_CONNECTION || "",
  lineClientId: process.env.LINE_CLIENT_ID || "",
  lineClientSecret: process.env.LINE_CLIENT_SECRET || "",
  lineRedirectUri: process.env.LINE_REDIRECT_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
};

type Env = {
  environment: Environment;
  port: string;
  mongoConnection: string;
  lineClientId: string;
  lineClientSecret: string;
  lineRedirectUri: string;
  jwtSecret: string;
};

type Environment = "LOCAL" | "DEV" | "PROD";

export default env;
