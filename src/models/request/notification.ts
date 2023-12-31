import { IsEnum, IsNotEmpty, IsOptional, IsString, isBoolean } from 'class-validator';

import { Role } from '../../enums/Role';
import { ConfirmStatus } from '../../enums/ConfirmStatus';

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

export class NotificationUpdateRequest {
    @IsEnum(ConfirmStatus)
    @IsOptional()
    confirmStatus: ConfirmStatus;
}
