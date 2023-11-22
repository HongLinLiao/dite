import UserModel from "../models/mongo/User";
import User from "../models/service/User";

export async function queryUserByhMail(mail: string) {
  const user = await UserModel.findOne({ email: mail }).exec();
  return user && User.toServiceModel(user);
}

export async function queryUserById(id: string) {
  const user = await UserModel.findById(id).exec();
  return user && User.toServiceModel(user);
}

export async function createUser(user: User) {
  const newUser = await new UserModel({
    name: user.name,
    email: user.email,
    loginType: user.loginType,
    photoUrl: user.photoUrl,
    createTime: user.createTime,
  }).save();

  return User.toServiceModel(newUser);
}
