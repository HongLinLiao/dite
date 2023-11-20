import * as dotenv from "dotenv";
const NODE_ENV = process.env.NODE_ENV;
dotenv.config({ path: NODE_ENV ? `.env.${NODE_ENV}` : ".env" });

const env: Env = {
  environment: process.env.ENV as Environment,
  port: process.env.PORT || "3000",
  mongoConnection: process.env.MONGO_CONNECTION || "",
};

type Env = {
  environment: Environment;
  port: string;
  mongoConnection: string;
};

type Environment = "DEV" | "PROD";

export default env;
