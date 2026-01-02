import { IsString, IsUUID, IsOptional, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(500)
  filePath: string;

  @IsString()
  @MaxLength(100)
  mimeType: string;

  @IsUUID()
  condominiumId: string;

  @IsOptional()
  @IsUUID()
  expenseId?: string;
}
