import { LoginType } from "../enums/LoginType";
import { JwtField, ThirdPartyJwtInfo, issueToken, verifyToken } from "../utils/jwt";
import {
  getOAuthEndpoint,
  getToken,
  getUserProfile,
  verifyIdToken,
} from "../utils/line";
import { createUser, queryUserByThirdParty } from "./user";

export async function lineLogin(code: string): Promise<ThirdPartyJwtInfo> {
  const tokenData = await getToken(code);
  const profile = await getUserProfile(tokenData.access_token);

  if (!tokenData.id_token) {
    throw new Error("LINE Login Error!");
  }

  const jwtInfo = await verifyIdToken(tokenData.id_token);

  return {
    uid: profile.userId,
    userName: profile.displayName,
    avatar: profile.pictureUrl,
    loginType: LoginType.LINE,
    email: jwtInfo.email,
  };
}

export async function login(
  thirdPartyInfo: ThirdPartyJwtInfo
): Promise<string> {
  const { uid, loginType, userName, avatar, email } = thirdPartyInfo;

  let user = await queryUserByThirdParty(loginType, uid);
  if (!user) {
    user = await createUser({
      name: userName,
      email: email,
      loginType: loginType,
      thirdPartyUid: uid,
      photoUrl: avatar,
      createTime: new Date().getTime(),
    });
  } else {
    // TODO: Check user data align
  }

  const jwtInfo: JwtField = {
    uid: user.id!,
    userName: user.name,
    avatar: user.photoUrl,
    loginType: user.loginType,
    email: user.email,
    thirdPartyUid: user.thirdPartyUid,
  };
  return issueToken(jwtInfo);
}

export function authentication(token: string) {
  const tokenData = verifyToken(token);
  return tokenData;
}

export function getLineEndpoint(): string {
  return getOAuthEndpoint();
}
