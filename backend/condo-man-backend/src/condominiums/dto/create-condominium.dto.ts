import { IsString, IsInt, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateCondominiumDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  address: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsString()
  @MaxLength(20)
  postalCode: string;

  @IsInt()
  @Min(1)
  totalUnits: number;

  @IsUUID()
  companyId: string;
}
