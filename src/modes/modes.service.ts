import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModeDto } from './dto/create-mode.dto';
import { UpdateModeDto } from './dto/update-mode.dto';
import { Mode } from './entities/mode.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ModesService {

  constructor(
    @InjectModel(Mode.name)
    private readonly modeModel: Model<Mode>,
  ){}

  async create(createModeDto: CreateModeDto) {
    
    createModeDto.slug = createModeDto.name.split(' ').join('_').toLowerCase();
    const mode = await this.modeModel.create(createModeDto);
     
     return mode;
  }

 async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const modes = await this.modeModel.find({
      take: limit,
      skip: offset,
      });

    return modes
  }

  async findOne(id: string) {

    let mode: Mode;

    if (isValidObjectId(id)) {
      mode = await this.modeModel.findById(id);
    }

    if (!mode) throw new NotFoundException('');

    return mode;
  }

  update(id: number, updateModeDto: UpdateModeDto) {
    return `This action updates a #${id} mode`;
  }

  remove(id: number) {
    return `This action removes a #${id} mode`;
  }
}
