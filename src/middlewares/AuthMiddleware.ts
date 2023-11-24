import { Request, Response, NextFunction } from "express";
import { authentication as verify } from "../services/auth";

export default function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log('test');
    
    const { authorization } = req.headers;
    verify(authorization?.split(" ")[1] ?? "");
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized!");
  }
}
