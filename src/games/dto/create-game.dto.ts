import { IsBoolean, IsNumber, IsMongoId, Min } from 'class-validator';

export class CreateGameDto {

    @IsBoolean()
    win: boolean
    
    @IsBoolean()
    argoya: boolean
   
    @IsNumber()
    @Min(0)
    kills: number

    @IsNumber()
    @Min(0)
    deaths: number
    
    @IsMongoId()
    user_id: string
    
    @IsMongoId()
    mode_id: string

}
