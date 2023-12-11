import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { Role } from '../../enums/Role';

export class GroupInviteRequest {
    @IsString()
    @IsNotEmpty()
    gid: string;

    @IsString()
    @IsNotEmpty()
    uid: string;

    @IsEnum(Role)
    role: Role;
}
