import { Schema, model } from "mongoose";

import IUser from "../data/User";
import { LoginType } from "../../enums/LoginType";
import { addIdField } from "../../utils/mongo";

export let UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  loginType: {
    type: Number,
    enum: LoginType,
    default: LoginType.LINE,
    required: true,
  },
  thirdPartyUid: { type: String },
  photoUrl: { type: String },
  createTime: { type: Number, required: true },
});

addIdField(UserSchema);

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
