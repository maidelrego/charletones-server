import { PartialType } from '@nestjs/mapped-types';
import { CreateCodGameDto } from './create-cod-game.dto';

export class UpdateCodGameDto extends PartialType(CreateCodGameDto) {}
