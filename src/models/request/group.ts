import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupRequest {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}

export class GroupUpdateRequest {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
