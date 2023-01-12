import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';


export class UpdateUserDto extends PartialType(CreateUserDto) {
    _id: string;
    cloudinary_id: string;
    avatar: string;
    fullName: string;
    roles: string[];
}