import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @MaxLength(200)
  name!: string;

  @IsUrl()
  @MaxLength(2000)
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}