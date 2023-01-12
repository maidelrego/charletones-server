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
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { UpdateUserDto } from './dto/update-user.dto';

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
        fileIsRequired: false
      }),
    )
    image: Express.Multer.File,
    ) {
      
      if (!image) return this.authService.create(createUserDto);

      const { secure_url, asset_id } = await this.cloudinaryService.uploadImage(
        { folder: 'Avatars' },
        image,
      );  
      createUserDto.avatar = secure_url;
      createUserDto.cloudinary_id = asset_id;

    return this.authService.create(createUserDto);
  }

  @Post('updateUser/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateUser(
    @Param('id',ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 311000 })],
        fileIsRequired: false
      }),
    )
    image: Express.Multer.File,
    ) {
      if (!image) {
        console.log('no image');
        return this.authService.update(id, updateUserDto);
      } else {
        console.log('image');
        const { cloudinary_id } = updateUserDto;

        if (cloudinary_id) {
          await this.cloudinaryService.deleteImages(cloudinary_id);
        }

        const { secure_url, asset_id } = await this.cloudinaryService.uploadImage(
          { folder: 'Avatars' },
          image,
        );
        updateUserDto.avatar = secure_url;
        updateUserDto.cloudinary_id = asset_id;

        return this.authService.update(id, updateUserDto);
      }
        

    //   const { secure_url, asset_id } = await this.cloudinaryService.uploadImage(
    //     { folder: 'Avatars' },
    //     image,
    //   );
    //   updateUserDto.avatar = secure_url;
    //   updateUserDto.cloudinary_id = asset_id;

    // return this.authService.update(id, updateUserDto);
    }

  @Get('users')
  getAllUsers(@Query() paginationDto: PaginationDto){
    return this.authService.findAll(paginationDto);
  }

  @Get('user/:id')
  getOneByEmail(@Param('id',ParseMongoIdPipe) id: string){
    return this.authService.findOneById(id);
  }
   
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
