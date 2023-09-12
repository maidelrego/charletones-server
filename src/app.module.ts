/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { GamesModule } from './games/games.module';
import { ModesModule } from './modes/modes.module';
import { AuthModule } from './auth/auth.module';
import { TeamsModule } from './teams/teams.module';
import { CodGamesModule } from './cod-games/cod-games.module';
import { CodUserStatsModule } from './cod-user-stats/cod-user-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: JoiValidationSchema,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    CommonModule,
    CloudinaryModule,
    GamesModule,
    ModesModule,
    AuthModule,
    TeamsModule,
    CodGamesModule,
    CodUserStatsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
