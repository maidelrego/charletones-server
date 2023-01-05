import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Game, GameSchema } from './entities/game.entity';
import { AuthModule } from '../auth/auth.module';
import { ModesModule } from '../modes/modes.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports: [
  MongooseModule.forFeature([
      {
        name: Game.name,
        schema: GameSchema,
      },
    ]),
    AuthModule,
    ModesModule
  ],
  exports: [MongooseModule,GamesService]
})
export class GamesModule {}
