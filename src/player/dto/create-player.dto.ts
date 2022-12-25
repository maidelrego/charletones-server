import {IsString, MinLength, IsOptional } from 'class-validator';

export class CreatePlayerDto {
 
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsOptional()
  image?: Express.Multer.File;

  @IsOptional()
  total_team_wins?: number;

  @IsOptional()
  total_alone_wins?: number;
  
  @IsOptional()
  total_team_loses?: number;

  @IsOptional()
  total_alone_loses?: number;

  @IsOptional()
  cloudinary_id?: string;

  @IsOptional()
  total_kill?: number;

  @IsOptional()
  total_deads?: number;

  @IsOptional()
  playerType?: boolean;
}
