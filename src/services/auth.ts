import User from "../models/service/User";
import { createUser, queryUserByhMail } from "./user";

export async function signUp(user: User) {
  const exist = await queryUserByhMail(user.email);

  if (exist) {
    throw new Error("User Exist!");
  }

  return await createUser(user);
}
