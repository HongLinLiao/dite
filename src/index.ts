import express, { Express, Request, Response, json, urlencoded } from "express";

import env from "./utils/env";
import { initMongoDB } from "./utils/mongo";
import AuthRouter from "./routes/auth";
import LungRouter from "./routes/lung";
import AuthMiddleware from "./middlewares/AuthMiddleware";

const port = env.port;
const app: Express = express();

app.use(urlencoded({ extended: false }));
app.use(json());

initMongoDB();

const prefix = "/api";
app.use(`${prefix}/auth`, AuthRouter);
app.use(`${prefix}/lung`, [AuthMiddleware], LungRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(
    `🚀 ${env.environment} Server is running at http://localhost:${port}`
  );
});
