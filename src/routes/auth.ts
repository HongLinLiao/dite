import { Router, Request, Response } from "express";

import { signUp } from "../services/auth";

const AuthRouter = Router();

AuthRouter.post("/signUp", async (req: Request, res: Response) => {
  const { name, email, loginType } = req.body;

  const user = await signUp({
    name,
    email,
    loginType,
    photoUrl: req.body.photoUrl || null,
    createTime: new Date().getTime(),
  });
  res.json(user);
});

export default AuthRouter;
