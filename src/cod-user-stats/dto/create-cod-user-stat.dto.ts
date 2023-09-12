import { IsMongoId, IsNumber, Min } from 'class-validator';

export class CreateCodUserStatDto {
  @IsNumber()
  @Min(0)
  kills: number;

  @IsNumber()
  @Min(0)
  deaths: number;

  @IsMongoId()
  user: string;
}
