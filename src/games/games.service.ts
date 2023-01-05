import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { AuthService } from 'src/auth/auth.service';
import { ModesService } from '../modes/modes.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GamesService {
  
  private readonly logger = new Logger('GameServices');


  constructor(
    @InjectModel(Game.name)
    private readonly gameModel: Model<Game>,
    private readonly authService: AuthService,
    private readonly modeService: ModesService,
  ){}
  

  async create(createGameDto: CreateGameDto) {
    
   const {user_id, mode_id} = createGameDto;
   
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

  async findAll( paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const games = await this.gameModel.find({
      take: limit,
      skip: offset,
      }).populate(['user','mode']);

    return games
  }

  async findByMode(id: string) {
    
    const games = await this.gameModel.find({mode: id }).populate(['user','mode']);
  
    return games
  }

  // update(id: number, updateGameDto: UpdateGameDto) {
  //   return `This action updates a #${id} game`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} game`;
  // }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException();
  }
}
