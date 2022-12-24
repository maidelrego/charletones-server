import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaginationDto } from '../common/dto/pagination.dto';

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
     
     const { secure_url, public_id } = await this.cloudinaryService.uploadImage({folder: 'Avatars'},image);
     createPlayerDto.avatar = secure_url;
     createPlayerDto.cloudinary_id = public_id;     
          
    return this.playerService.create(createPlayerDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.playerService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.update(+id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playerService.remove(+id);
  }
}
