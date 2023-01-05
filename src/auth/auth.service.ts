import {
  Injectable,
  BadRequestException,
  Logger,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PaginationDto } from '../common/dto/pagination.dto';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthServices');

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...resOfUser } = createUserDto;

      const user = await this.userModel.create({
        ...resOfUser,
        password: bcrypt.hashSync(password, 10),
      });

      return {
        user,
        token: this.getJwtToken({ id: user._id.toString() }),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  public checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user._id.toString() }),
    };
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    // const user = await this.userRepository.findOne({
    //   where: { email },
    //   select: { email: true, password: true, id: true },
    // });

    // if (!user || !bcrypt.compareSync(password, user.password))
    //   throw new UnauthorizedException('Not valid credentials');

    // delete user.password;

    // return {
    //   ...user,
    //   token: this.getJwtToken({ id: user.id }),
    // };
  }

  async findAll(paginationDto: PaginationDto){
    console.log(paginationDto);
    
    const { limit = 10, offset = 0 } = paginationDto;

    const users = await this.userModel.find({
      take: limit,
      skip: offset,
     });

    return users;
  }

  async findOne( id: string ){
  
      let user: User;

      if (isValidObjectId(id)) {
        user = await this.userModel.findById(id);
      }

      if (!user) throw new NotFoundException('');

      return user;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException();
  }
}
