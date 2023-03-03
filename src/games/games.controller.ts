import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  findGamesByMode(@Param('id', ParseMongoIdPipe) id: string) {
    return this.gamesService.findByMode(id);
  }

  @Get('/by-date/:id')
  @UseGuards(AuthGuard('jwt'))
  findGamesByDate(@Param('id', ParseMongoIdPipe) id: string) {
    return this.gamesService.findAndGroupByDate(id);
  }

  @Get('/user-most-wins')
  @UseGuards(AuthGuard('jwt'))
  findUserWithMostWins() {
    return this.gamesService.findUserWithMostWins();
  }

  @Get('/user-most-loses')
  @UseGuards(AuthGuard('jwt'))
  findUserWithMostLosses() {
    return this.gamesService.getUserWithMostArgoyaOverall();
  }
}
