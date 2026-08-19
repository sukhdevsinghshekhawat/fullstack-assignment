import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskPriority } from '@prisma/client';

export class QueryProjectDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsUUID('4')
  lead?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
