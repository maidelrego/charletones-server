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
      return this.codGame
        .find()
        .populate({
          path: 'participants',
          populate: {
            path: 'user', // Populate the 'user' field within 'participants'
            model: 'User', // Replace 'User' with the actual model name of the 'user' entity
          },
        })
        .populate('win')
        .lean();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} codGame`;
  }

  async getGamesGroupedByDate(): Promise<
    { date: Date; winners: { mode: number; team: any }[] }[]
  > {
    const games = await this.findAll();

    // Group games by date
    const groupedGames: Map<
      string,
      { mode: number; winners: { mode: number; team: any }[] }
    > = new Map();
    for (const game of games) {
      const gameDate = game.createdAt.toISOString().split('T')[0]; // Assuming 'createdAt' is the date field
      const winners = game.win ? [{ mode: game.mode, team: game.win }] : [];

      if (groupedGames.has(gameDate)) {
        const existingData = groupedGames.get(gameDate);
        existingData.winners = [...existingData.winners, ...winners];
        groupedGames.set(gameDate, existingData);
      } else {
        groupedGames.set(gameDate, { mode: game.mode, winners });
      }
    }

    // Convert the map to an array of objects
    const timeline: { date: Date; winners: { mode: number; team: any }[] }[] =
      [];
    groupedGames.forEach(({ mode, winners }, date) => {
      timeline.push({ date: new Date(date), winners });
    });

    return timeline;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException();
  }
}
