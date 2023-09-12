import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CodGamesService } from './cod-games.service';
import { CreateCodGameDto } from './dto/create-cod-game.dto';

@Controller('cod-games')
export class CodGamesController {
  constructor(private readonly codGamesService: CodGamesService) {}

  @Post()
  create(@Body() createCodGameDto: CreateCodGameDto) {
    return this.codGamesService.create(createCodGameDto);
  }

  @Get()
  findAll() {
    return this.codGamesService.findAll();
  }

  @Get('timeline')
  getGamesGroupedByDate() {
    return this.codGamesService.getGamesGroupedByDate();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codGamesService.findOne(+id);
  }
}
