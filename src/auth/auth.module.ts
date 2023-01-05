import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt-strategy';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ConfigModule,
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    CloudinaryModule,
    // JwtModule.register({ //normal implementation
    //   secret: process.env.JWT_SECRET,
    //   signOptions:{
    //     expiresIn: '2h'
    //   }
    // })
    JwtModule.registerAsync({ //async implementation
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '20s'
          }
        }
      }

    })
  ],
  exports: [MongooseModule,JwtStrategy,PassportModule,JwtModule,AuthService]

})
export class AuthModule { }
