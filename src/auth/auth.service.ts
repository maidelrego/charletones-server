import {
  Injectable,
  BadRequestException,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthServices');

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { image, password, ...resOfUser } = createUserDto;

      if (image) {
        const { secure_url, asset_id } =
          await this.cloudinaryService.uploadImage(
            { folder: 'Avatars' },
            image,
          );
        resOfUser.avatar = secure_url;
        resOfUser.cloudinary_id = asset_id;
      }

      const user = await this.userModel.create({
        ...resOfUser,
        password: bcrypt.hashSync(password, 10),
      });

      const newUser = {
        _id: user._id,
        token: this.getJwtToken({ id: user._id.toString() }),
      };

      return {
        ...newUser,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(updateUserDto: UpdateUserDto, id: string) {
    let newPassword = '';
    const user = await this.findOne(id);
    newPassword = user.password;
    const { image, password, ...resOfUser } = updateUserDto;

    if (password) {
      newPassword = bcrypt.hashSync(password, 10);
    }

    if (image) {
      if (user.cloudinary_id) {
        await this.cloudinaryService.deleteImages(user.cloudinary_id);
      }

      const { secure_url, asset_id } = await this.cloudinaryService.uploadImage(
        { folder: 'Avatars' },
        image,
      );

      resOfUser.avatar = secure_url;
      resOfUser.cloudinary_id = asset_id;
    }

    try {
      await user.updateOne(
        {
          ...resOfUser,
          password: newPassword,
        },
        { new: true },
      );
    } catch (error) {
      this.handleDBExceptions(error);
    }

    return { ...user.toJSON(), ...resOfUser };
  }

  public checkAuthStatus(user: User) {
    const authUser = {
      _id: user._id,
      token: this.getJwtToken({ id: user._id.toString() }),
    };

    return authUser;
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user) throw new BadRequestException('Invalid credentials (email)');

    if (await !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Not valid credentials');

    const validatedUser = {
      _id: user._id,
      token: this.getJwtToken({ id: user._id.toString() }),
    };

    return validatedUser;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const users = await this.userModel.find({
      take: limit,
      skip: offset,
    });

    return users;
  }

  async findOne(id: string) {
    let user: User;

    if (isValidObjectId(id)) {
      user = await this.userModel.findById(id);
    }

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException();
  }
}
