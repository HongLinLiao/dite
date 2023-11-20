import { LoginType } from "../../enums/LoginType";
import IUser from "../data/User";

export default class User {
  id?: string;
  name: string;
  email: string;
  loginType: LoginType;
  photoUrl?: string;
  createTime: number;

  static toServiceModel(user: IUser): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      loginType: user.loginType,
      photoUrl: user.photoUrl,
      createTime: user.createTime,
    };
  }
}