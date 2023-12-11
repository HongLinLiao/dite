import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Role } from '../../enums/Role';

export class CreateGroupRequest {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}

export class SearchGroupRequest {
    @IsString()
    @IsNotEmpty()
    keyword: string;
}