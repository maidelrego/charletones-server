import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Model } from 'mongoose';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name)
    private readonly teamModel: Model<Team>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    try {
      const { image, ...restOfTeam } = createTeamDto;

      if (image) {
        const { secure_url, asset_id } =
          await this.cloudinaryService.uploadImage(
            { folder: 'Avatars' },
            image,
          );
        restOfTeam.avatar = secure_url;
        restOfTeam.cloudinary_id = asset_id;
      }

      const team = await this.teamModel.create({
        ...restOfTeam,
      });

      return team.save();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    try {
      return this.teamModel.find().populate('members');
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException();
  }
}
