import { PartialType } from '@nestjs/mapped-types';
import { CreateRocketLeagueGameDto } from './create-rocket-league-game.dto';

export class UpdateRocketLeagueGameDto extends PartialType(
  CreateRocketLeagueGameDto,
) {}
