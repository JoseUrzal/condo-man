import {
  IsString,
  IsNumber,
  IsEnum,
  IsUUID,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ExpenseType } from '../../common/enums';

export class CreateExpenseDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsEnum(ExpenseType)
  type: ExpenseType;

  @IsUUID()
  condominiumId: string;
}
