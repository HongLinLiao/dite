import axios from 'axios';
import { v4 as uuid } from 'uuid';

import env from './env';

const LINE_AUTHORIZE_ENDPOINT = 'https://access.line.me/oauth2/v2.1';
const LINE_OAUTH_ENDPOINT = 'https://api.line.me/oauth2/v2.1';
const LINE_USER_PROFILE_ENDPOINT = 'https://api.line.me/v2';
const REQUEST_CONTENT_TYPE = 'application/x-www-form-urlencoded';
const SCOPE = 'profile%20openid%20email';

export function getOAuthEndpoint(): string {
    const { lineClientId, lineRedirectUri } = env;

    const queryStrings: { key: string; value: string }[] = [
        { key: 'response_type', value: 'code' },
        { key: 'client_id', value: lineClientId },
        { key: 'redirect_uri', value: lineRedirectUri },
        { key: 'state', value: uuid() },
        { key: 'scope', value: SCOPE },
    ];

    return `${LINE_AUTHORIZE_ENDPOINT}/authorize?${queryStrings.map((e) => `${e.key}=${e.value}`).join('&')}`;
}

export async function getToken(code: string): Promise<LINEOAuth> {
    const { lineClientId, lineClientSecret, lineRedirectUri } = env;

    const res = await axios.request({
        method: 'POST',
        url: `${LINE_OAUTH_ENDPOINT}/token`,
        headers: { 'Content-Type': REQUEST_CONTENT_TYPE },
        data: {
            grant_type: 'authorization_code',
            code,
            redirect_uri: lineRedirectUri,
            client_id: lineClientId,
            client_secret: lineClientSecret,
        },
    });

    return res.data as LINEOAuth;
}

export async function verifyToken(accessToken: string): Promise<LINEOAuthVerify> {
    const res = await axios.request({
        method: 'GET',
        url: `${LINE_OAUTH_ENDPOINT}/verify`,
        headers: {
            'Content-Type': REQUEST_CONTENT_TYPE,
        },
        params: {
            access_token: accessToken,
        },
    });

    return res.data as LINEOAuthVerify;
}

export async function verifyIdToken(idToken: string, nonce?: string, userId?: string): Promise<LINEJWTVerify> {
    const { lineClientId } = env;

    const res = await axios.request({
        url: `${LINE_OAUTH_ENDPOINT}/verify`,
        method: 'POST',
        headers: {
            'Content-Type': REQUEST_CONTENT_TYPE,
        },
        data: {
            id_token: idToken,
            client_id: lineClientId,
            nonce,
            user_id: userId,
        },
    });

    return res.data as LINEJWTVerify;
}

// export async function refreshToken(token: string): Promise<LINEOAuth> {
//     const { lineClientId, lineClientSecret } = env;

//     const res = await axios.request({
//         url: `${LINE_OAUTH_ENDPOINT}/token`,
//         method: 'POST',
//         headers: {
//             'Content-Type': REQUEST_CONTENT_TYPE,
//         },
//         data: {
//             grant_type: 'refresh_token',
//             refresh_token: token,
//             client_id: lineClientId,
//             client_secret: lineClientSecret,
//         },
//     });

//     return res.data as LINEOAuth;
// }

export async function getUserProfile(accessToken: string) {
    const res = await axios.request({
        method: 'GET',
        url: `${LINE_USER_PROFILE_ENDPOINT}/profile`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return res.data as LINEUserProfile;
}

export interface LINEOAuth {
    access_token: string;
    expires_in: number;
    id_token?: string;
    refresh_token: string;
    scope: string;
    token_type: string;
}

export interface LINEJWTVerify {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    nonce: string;
    amr: string[];
    name: string;
    picture: string;
    email: string;
}

export interface LINEOAuthVerify {
    scope: string;
    client_id: number;
    expires_in: number;
}

export interface LINEUserProfile {
    userId: string;
    displayName: string;
    pictureUrl: string;
    statusMessage: string;
}
