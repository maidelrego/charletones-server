import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<Player>,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService

  ) {}

  async create(createPlayerDto: CreatePlayerDto) {
    createPlayerDto.name = createPlayerDto.name.toLocaleLowerCase();

    try {
      const newPlayer = await this.playerModel.create(createPlayerDto);
      return newPlayer;
    } catch (error) {
      this.handleExeptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 50, offset = 0 } = paginationDto;

    return this.playerModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 'asc' });
  }

  async findOne(id: string) {
    let player: Player;
    player = await this.playerModel.findById(id);
    if (!player) throw new NotFoundException(`Player with id :: ${id} not exist `);

    return player;
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto) {
    
    const { image } = updatePlayerDto;
    const player = await this.findOne(id);
    
    if(image){
       
          await this.cloudinaryService.deleteImages(player.cloudinary_id);
          const {secure_url,asset_id} = await this.cloudinaryService.uploadImage({folder: 'Avatars'},image);
          updatePlayerDto.avatar = secure_url;
          updatePlayerDto.cloudinary_id = asset_id;   
    }

    if (updatePlayerDto.name)
      updatePlayerDto.name = updatePlayerDto.name.toLowerCase();

    try {
      await player.updateOne(updatePlayerDto);
    } catch (error) {
      this.handleExeptions(error);
    }
  }

  async remove(id: string) {
    const player = await this.findOne(id);
    await this.cloudinaryService.deleteImages(player.cloudinary_id);
    await player.deleteOne();
    
    return;
  }

  private handleExeptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Player exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }

    throw new InternalServerErrorException();
  }
}
