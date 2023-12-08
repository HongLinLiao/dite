import { LoginType } from '../../enums/LoginType';

export default interface IUser {
    id: string;
    name: string;
    email: string;
    loginType: LoginType;
    thirdPartyUid?: string;
    photoUrl?: string;
    createTime: number;
}
