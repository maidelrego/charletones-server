import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsOptional()
  image?: Express.Multer.File;

  @IsOptional()
  cloudinary_id?: string;

  @IsOptional()
  @IsString()
  mode?: string;

  @IsOptional()
  @IsArray()
  members?: string[];
}
