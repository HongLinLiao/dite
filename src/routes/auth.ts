import { Router, Request, Response } from "express";

import { getLineEndpoint, lineLogin, login } from "../services/auth";
import { LoginType } from "../enums/LoginType";
import AuthMiddleware from "../middlewares/AuthMiddleware";

const AuthRouter = Router();

AuthRouter.post("/signIn", async (req: Request, res: Response) => {
  const { code, loginType } = req.body;

  if (loginType === LoginType.LINE) {
    const jwtInfo = await lineLogin(code);
    const jwt = await login(jwtInfo);
    res.send(jwt);
  } else {
    throw new Error("Invalid Login Agent!");
  }
});

AuthRouter.post(
  "/",
  AuthMiddleware,
  async (req: Request, res: Response) => {
    res.json({});
  }
);

AuthRouter.get("/line/endpoint", (req: Request, res: Response) => {
  const endpoint = getLineEndpoint();
  res.send(endpoint);
});

export default AuthRouter;
