import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { UploadApiResponse } from 'cloudinary';

@Controller('player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
    private readonly cloudinaryService: CloudinaryService
    ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
 async create(
     @Body() createPlayerDto: CreatePlayerDto,
     @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 311000 }),
        ],
      })
     ) image: Express.Multer.File,
     ){
     
     const {secure_url,asset_id} = await this.cloudinaryService.uploadImage({folder: 'Avatars'},image);
     
     createPlayerDto.avatar = secure_url;
     createPlayerDto.cloudinary_id = asset_id;     
          
    return this.playerService.create(createPlayerDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.playerService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id',ParseMongoIdPipe) id: string) {
    return this.playerService.findOne(id);
  }

  @Post('edit/:id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id',ParseMongoIdPipe) id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 311000 }),
        ],
      })
     ) image: Express.Multer.File,
    ) {
    
     updatePlayerDto.image = image; 
     return this.playerService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseMongoIdPipe) id: string) {
    return this.playerService.remove(id);
  }
}
