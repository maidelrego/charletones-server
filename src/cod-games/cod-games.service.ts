import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCodGameDto } from './dto/create-cod-game.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CodGame } from './entities/cod-game.entity';
import { CodUserStat } from '../cod-user-stats/entities/cod-user-stat.entity';

@Injectable()
export class CodGamesService {
  constructor(
    @InjectModel(CodGame.name)
    private readonly codGame: Model<CodGame>,
    @InjectModel(CodUserStat.name)
    private readonly codUserStat: Model<CodUserStat>,
  ) {}

  async create(createCodGameDto: CreateCodGameDto) {
    const { participants, ...rest } = createCodGameDto;

    const codUserStats = await Promise.all(
      participants.map(async (participant) => {
        const { user, kills, deaths } = participant;
        const codUserStat = new this.codUserStat({
          user,
          kills,
          deaths,
        });
        await codUserStat.save();
        return codUserStat;
      }),
    );

    const participantIds = codUserStats.map((stat) => stat._id);

    const codGame = new this.codGame({
      participants: participantIds,
      ...rest,
    });

    await codGame.save();

    return codGame;
  }

  findAll() {
    try {
      return this.codGame.find().populate({
        path: 'participants',
        populate: {
          path: 'user', // Populate the 'user' field within 'participants'
          model: 'User', // Replace 'User' with the actual model name of the 'user' entity
        },
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} codGame`;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException();
  }
}
