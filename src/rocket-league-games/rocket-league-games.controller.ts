import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RocketLeagueGamesService } from './rocket-league-games.service';
import { CreateRocketLeagueGameDto } from './dto/create-rocket-league-game.dto';

@Controller('rocket-league-games')
export class RocketLeagueGamesController {
  constructor(
    private readonly rocketLeagueGamesService: RocketLeagueGamesService,
  ) {}

  @Post()
  create(@Body() createRocketLeagueGameDto: CreateRocketLeagueGameDto) {
    return this.rocketLeagueGamesService.create(createRocketLeagueGameDto);
  }

  @Get()
  findAll() {
    return this.rocketLeagueGamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rocketLeagueGamesService.findOne(+id);
  }
}
