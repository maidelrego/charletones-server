import { Module } from '@nestjs/common';
import { CodGamesService } from './cod-games.service';
import { CodGamesController } from './cod-games.controller';
import { CodGame, CodGameShema } from './entities/cod-game.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { CodUserStatsModule } from '../cod-user-stats/cod-user-stats.module';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  controllers: [CodGamesController],
  providers: [CodGamesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: CodGame.name,
        schema: CodGameShema,
      },
    ]),
    CodUserStatsModule,
    TeamsModule,
  ],
  exports: [CodGamesService, MongooseModule],
})
export class CodGamesModule {}
