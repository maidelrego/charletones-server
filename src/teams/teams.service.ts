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
          await this.cloudinaryService.uploadImage({ folder: 'Team' }, image);
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

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const teamToUpdate = await this.findOne(id);

    if (!teamToUpdate) throw new BadRequestException('Team not found');

    const { image, ...restOfTeam } = updateTeamDto;

    if (image) {
      if (teamToUpdate.cloudinary_id) {
        this.cloudinaryService.deleteImages(teamToUpdate.cloudinary_id);
      }
      const { secure_url, asset_id } = await this.cloudinaryService.uploadImage(
        { folder: 'Team' },
        image,
      );
      restOfTeam.avatar = secure_url;
      restOfTeam.cloudinary_id = asset_id;
    }

    try {
      const updatedTeam = await this.teamModel.findByIdAndUpdate(
        id,
        restOfTeam,
      );
      return updatedTeam;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      return this.teamModel.findById(id).populate('members');
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException();
  }
}
