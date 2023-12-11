import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateLungRequest {
    @IsString()
    @IsNotEmpty()
    uid: string;

    @IsInt()
    @Min(1911)
    @Max(2099)
    year: number;

    @IsInt()
    @Min(1)
    @Max(12)
    month: number;

    @IsInt()
    @Min(1)
    @Max(31)
    day: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(99999)
    standardQuantity?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(99999)
    packingQuantity?: number;
}
