import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCodUserStatDto } from './dto/create-cod-user-stat.dto';
import { CodUserStat } from './entities/cod-user-stat.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CodUserStatsService {
  constructor(
    @InjectModel(CodUserStat.name)
    private readonly codUserStatModel: Model<CodUserStat>,
  ) {}

  async create(createCodUserStatDto: CreateCodUserStatDto) {
    try {
      const stat = await this.codUserStatModel.create({
        ...createCodUserStatDto,
      });

      return stat.save();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all codUserStats`;
  }

  async getAllTimeStats(): Promise<any[]> {
    const aggregatedStats = await this.codUserStatModel.aggregate([
      {
        $group: {
          _id: '$user',
          totalKills: { $sum: '$kills' },
          totalDeaths: { $sum: '$deaths' },
        },
      },
      {
        $project: {
          _id: 0,
          user: '$_id',
          totalKills: 1,
          totalDeaths: 1,
          kdRatio: {
            $cond: [
              { $eq: ['$totalDeaths', 0] }, // Handle division by zero
              '$totalKills',
              { $divide: ['$totalKills', '$totalDeaths'] },
            ],
          },
        },
      },
    ]);

    return aggregatedStats;
  }

  findOne(id: number) {
    return `This action returns a #${id} codUserStat`;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException();
  }
}
