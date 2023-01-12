import {
  Injectable,
  BadRequestException,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PaginationDto } from '../common/dto/pagination.dto';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async update(id, updateUserDto: UpdateUserDto) {
    console.log('updateUserDto', updateUserDto, id);

    const filter = { _id:  id};
    const update = { ...updateUserDto };

    const updatedUser = await this.userModel.findOneAndUpdate(filter, update, { new: true })

    return updatedUser;
  }

  
  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user) throw new BadRequestException('Invalid credentials (email)');

    if (await !bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Invalid credentials (password)');

    const validatedUser = {
      _id: user._id,
      cloudinary_id: user.cloudinary_id,
      avatar: user.avatar,
      fullName: user.fullName,
      roles: user.roles,
      token: this.getJwtToken({ id: user._id.toString() }),
    }

    return validatedUser
  }

  async findAll(paginationDto: PaginationDto){
    
    const { limit = 10, offset = 0 } = paginationDto;

    const users = await this.userModel.find({
      take: limit,
      skip: offset,
     });

    return users;
  }

  async findOneById( id: string ){
  
    let user: User;

    if (isValidObjectId(id)) {
      user = await this.userModel.findById(id);
    }

    if (!user) throw new NotFoundException('User not found');

    return user;
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

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException();
  }
}
