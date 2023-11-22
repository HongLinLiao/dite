import express, { Express, Request, Response, json } from "express";

import env from "./utils/env";
import { initMongoDB } from "./utils/mongo";
import AuthRouter from "./routes/auth";
import LungRouter from "./routes/lung";

const port = env.port;
const app: Express = express();

app.use(json());

initMongoDB();

const prefix = "/api";
app.use(`${prefix}/auth`, AuthRouter);
app.use(`${prefix}/lung`, LungRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(
    `🚀 ${env.environment} Server is running at http://localhost:${port}`
  );
});
