import {
  IsString,
  IsInt,
  IsNumber,
  IsUUID,
  IsOptional,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @MaxLength(20)
  doorNumber: string;

  @IsInt()
  floor: number;

  @IsString()
  @MaxLength(50)
  typology: string;

  @IsNumber()
  permillage: number;

  @IsUUID()
  condominiumId: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  ownerIds?: string[];
}
