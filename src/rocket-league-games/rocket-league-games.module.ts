import { Module } from '@nestjs/common';
import { RocketLeagueGamesService } from './rocket-league-games.service';
import { RocketLeagueGamesController } from './rocket-league-games.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RocketLeagueGames,
  RocketLeagueGamesShema,
} from './entities/rocket-league-game.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RocketLeagueGamesController],
  providers: [RocketLeagueGamesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: RocketLeagueGames.name,
        schema: RocketLeagueGamesShema,
      },
    ]),
    AuthModule,
  ],
})
export class RocketLeagueGamesModule {}
