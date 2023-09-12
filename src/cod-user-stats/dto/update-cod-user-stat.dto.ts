import { PartialType } from '@nestjs/mapped-types';
import { CreateCodUserStatDto } from './create-cod-user-stat.dto';

export class UpdateCodUserStatDto extends PartialType(CreateCodUserStatDto) {}
