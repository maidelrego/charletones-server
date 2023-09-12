import { IsArray, IsMongoId, IsOptional, IsNumber } from 'class-validator';
import { CreateCodUserStatDto } from '../..//cod-user-stats/dto/create-cod-user-stat.dto';

export class CreateCodGameDto {
  @IsMongoId()
  win: string;

  @IsNumber()
  mode: number;

  @IsOptional()
  @IsArray()
  participants: CreateCodUserStatDto[];
}
