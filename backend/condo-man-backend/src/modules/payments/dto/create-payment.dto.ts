import {
  IsNumber,
  IsEnum,
  IsUUID,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../../enums';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsUUID()
  unitId: string;

  @IsOptional()
  @IsUUID()
  expenseId?: string;
}
