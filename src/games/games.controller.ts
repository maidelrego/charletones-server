import { Controller, Get, Post, Body,Param,Query, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() paginationDto: PaginationDto) {
    return this.gamesService.findAll(paginationDto);
  }

  @Get('/by-mode/:id')
  @UseGuards(AuthGuard('jwt'))
  findGamesByEmail(@Param('id',ParseMongoIdPipe) id: string) {
    return this.gamesService.findByMode(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
  //   return this.gamesService.update(+id, updateGameDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.gamesService.remove(+id);
  // }
}
