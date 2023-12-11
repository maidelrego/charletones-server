import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRocketLeagueGameDto } from './dto/create-rocket-league-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RocketLeagueGames } from './entities/rocket-league-game.entity';
import { Model } from 'mongoose';

@Injectable()
export class RocketLeagueGamesService {
  constructor(
    @InjectModel(RocketLeagueGames.name)
    private readonly rocketLeagueGame: Model<RocketLeagueGames>,
  ) {}

  async create(createRocketLeagueGameDto: CreateRocketLeagueGameDto) {
    const rocketLeagueGame = new this.rocketLeagueGame(
      createRocketLeagueGameDto,
    );
    await rocketLeagueGame.save();

    return rocketLeagueGame;
  }

  findAll() {
    try {
      return this.rocketLeagueGame
        .find()
        .populate({
          path: 'participants',
          select: 'name avatar _id',
        })
        .populate({
          path: 'win',
          select: 'name avatar _id',
        })
        .sort({ createdAt: -1 });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} rocketLeagueGame`;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException();
  }
}
