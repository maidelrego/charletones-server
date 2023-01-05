import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateModeDto {

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string

    @IsString()
    @IsOptional()
    slug: string
}
