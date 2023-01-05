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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: JoiValidationSchema,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    // TypeOrmModule.forRoot({
    //   type: 'mongodb',
    //   url: process.env.MONGO_URI,
    //   useNewUrlParser: true,
    //   logging: false,
    //   autoLoadEntities: true,
    //   synchronize: false,
    //   useUnifiedTopology: true
    // }),
    CommonModule,
    CloudinaryModule,
    GamesModule,
    ModesModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
