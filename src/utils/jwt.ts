import jwt from 'jsonwebtoken';

import env from './env';
import { LoginType } from '../enums/LoginType';

const expiresIn = '7d';
const issuer = 'Dite Dev';

export function issueToken(data: JwtField): string {
    const { jwtSecret } = env;
    return jwt.sign(data, jwtSecret, { expiresIn, issuer });
}

export function verifyToken(token: string): JwtInfo | null {
    const { jwtSecret } = env;
    return jwt.verify(token, jwtSecret, { issuer }) as JwtInfo;
}

export interface ThirdPartyJwtInfo {
    uid: string;
    userName: string;
    avatar?: string;
    loginType: LoginType;
    email: string;
}

export interface JwtField extends ThirdPartyJwtInfo {
    thirdPartyUid?: string;
}

export interface JwtInfo extends JwtField {
    iat: number;
    exp: number;
    iss: string;
}
