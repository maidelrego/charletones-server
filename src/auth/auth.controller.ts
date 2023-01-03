import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  SetMetadata,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { Auth, GetUser, RoleProtected } from './decorators/index';
import { ValidRoles } from './interfaces/valid-roles.interfece';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('auth')
export class AuthController {
  constructor(
     private readonly authService: AuthService,
     private readonly cloudinaryService: CloudinaryService,

     ) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 311000 })],
      }),
    )
    image: Express.Multer.File,
    ) {
      const { secure_url, asset_id } = await this.cloudinaryService.uploadImage(
        { folder: 'Avatars' },
        image,
      );  
      createUserDto.avatar = secure_url;
      createUserDto.cloudinary_id = asset_id;

    return this.authService.create(createUserDto);
  }

  @Get('users')
  getAllUsers(@Query() paginationDto: PaginationDto){
    return this.authService.findAll(paginationDto);
  }
   
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('checkAuth')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  //@SetMetadata('roles',['admin','super-user'])
  @Get('private')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute(@GetUser() user: User, @GetUser('email') email: string) {
    return {
      ok: true,
      msg: 'Hola Mundo',
      user,
      email,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.superUser)
  testingPrivateRoute3(@GetUser() user: User, @GetUser('email') email: string) {
    return {
      ok: true,
      msg: 'Hola Mundo',
      user,
      email,
    };
  }
}
