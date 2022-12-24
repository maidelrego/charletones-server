import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';


@Injectable()
export class PlayerService {
  
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<Player>,
    private readonly configService: ConfigService,
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

    return this.playerModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} player`;
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  remove(id: number) {
    return `This action removes a #${id} player`;
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

