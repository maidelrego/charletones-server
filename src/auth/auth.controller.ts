import {
  Controller,
  Get,
  Post,
  Body,
  // UseGuards,
  // SetMetadata,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Query,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/index';
// import { AuthGuard } from '@nestjs/passport';
// import { User } from './entities/user.entity';
// import { UserRoleGuard } from './guards/user-role.guard';
// import { Auth, GetUser, RoleProtected } from './decorators/index';
// import { ValidRoles } from './interfaces/valid-roles.interfece';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { Auth } from './decorators';
import { User } from './entities/user.entity';

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
        fileIsRequired: false,
      }),
    )
    image: Express.Multer.File,
  ) {
    createUserDto.image = image;
    return this.authService.create(createUserDto);
  }

  @Get('users')
  @Auth()
  getAllUsers(@Query() paginationDto: PaginationDto) {
    return this.authService.findAll(paginationDto);
  }

  @Get('checkAuth')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('user/:id')
  @Auth()
  getOneByEmail(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authService.findOne(id);
  }

  @Post('update/:id')
  @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async updateUser(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 311000 })],
        fileIsRequired: false,
      }),
    )
    image: Express.Multer.File,
  ) {
    updateUserDto.image = image;
    return this.authService.update(updateUserDto, id);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
