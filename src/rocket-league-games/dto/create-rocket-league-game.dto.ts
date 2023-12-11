import { IsArray, IsMongoId } from 'class-validator';

export class CreateRocketLeagueGameDto {
  @IsMongoId()
  win: string;

  @IsArray()
  participants: [];
}
