import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './entities/game.entity';
import { AuthService } from 'src/auth/auth.service';
import { ModesService } from '../modes/modes.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class GamesService {
  private readonly logger = new Logger('GameServices');

  constructor(
    @InjectModel(Game.name)
    private readonly gameModel: Model<Game>,
    private readonly authService: AuthService,
    private readonly modeService: ModesService,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const { user_id, mode_id } = createGameDto;

    try {
      const user = await this.authService.findOne(user_id);
      const mode = await this.modeService.findOne(mode_id);

      const createGame = new this.gameModel({
        ...createGameDto,
        mode,
        user,
      });

      return createGame.save();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const games = await this.gameModel
      .find({
        take: limit,
        skip: offset,
      })
      .populate(['user', 'mode']);

    return games;
  }

  async findByMode(id: string) {
    const games = await this.gameModel.find({ mode: id }).populate(['user']);
    return games.reverse();
  }

  async findUserWithMostWins() {
    // Find the users with the most wins per day
    const usersWithMostWinsPerDay = await this.gameModel.aggregate([
      // Group the matches by day and user
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            user: '$user',
          },
          wins: { $sum: { $cond: { if: '$win', then: 1, else: 0 } } },
        },
      },
      // Sort the results by day and wins in descending order
      { $sort: { '_id.day': -1, wins: -1 } },
      // Group the matches by day and find the user with the most wins
      {
        $group: {
          _id: '$_id.day',
          userWithMostWins: { $first: '$_id.user' },
          mostWins: { $first: '$wins' },
        },
      },
    ]);

    // Find the user with the most wins overall in a single day out of all days
    let userWithMostWins: any;
    let mostWins = 0;
    for (const user of usersWithMostWinsPerDay) {
      if (user.mostWins > mostWins) {
        userWithMostWins = user.userWithMostWins;
        mostWins = user.mostWins;
      }
    }

    const prettyObj = {
      user: userWithMostWins,
      wins: mostWins,
    };
    return prettyObj;
  }

  async getUserWithMostArgoyaOverall() {
    const result = await this.gameModel.aggregate([
      {
        $match: {
          argoya: true,
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$createdAt' },
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            user: '$user',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': -1,
          '_id.month': -1,
          '_id.day': -1,
          count: -1,
        },
      },
      {
        $group: {
          _id: '$_id.day',
          user: { $first: '$_id.user' },
          count: { $first: '$count' },
        },
      },
    ]);

    const topUser = result.reduce(
      (acc, curr) => {
        if (curr.count > acc.count) {
          acc = curr;
        }
        return acc;
      },
      { count: 0 },
    );

    const prettyObj = {
      user: topUser.user,
      argoya: topUser.count,
    };

    return prettyObj;
  }

  async findAndGroupByDate(id: string) {
    const games = await this.gameModel
      .find({ mode: id })
      .sort({ createdAt: -1 })
      .populate(['user']);
    const augmentedData = this.tableAugmentData(games);

    const groupedData = _.groupBy(augmentedData, 'createdAt');

    const winLossData = _.map(groupedData, (value, key) => {
      const wins = value.filter((game) => game.win);
      const losses = value.filter((game) => game.argoya);

      return {
        date: key,
        wins,
        losses,
      };
    });

    return winLossData;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException();
  }

  private tableAugmentData = (data) => {
    data = data.map((row) => {
      return {
        ...row._doc,
        createdAt: moment(row.createdAt).format('MM-DD-YYYY'),
        player: row.user.fullName,
      };
    });
    return data;
  };
}
