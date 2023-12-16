import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupRequest {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}
