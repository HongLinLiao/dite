import { IsOptional, IsString, Length } from 'class-validator';

export class CreateGroupRequest {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}

export class SearchGroupRequest {
    @IsString()
    @Length(1)
    keyword: string;
}
