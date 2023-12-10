import { IsString, IsEnum, IsOptional } from 'class-validator';

import { LoginType } from '../../enums/LoginType';

export class SignInRequest {
    @IsString()
    code: string;

    @IsEnum(LoginType)
    loginType: LoginType;
}
