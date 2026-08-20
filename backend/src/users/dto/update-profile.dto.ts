import {
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

/**
 * DTO for PATCH /users/me — allows the authenticated user to update
 * their own profile fields. Email is intentionally omitted so it can
 * never be changed through this endpoint.
 */
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message:
      'Username may only contain letters, numbers, underscores, dots and hyphens',
  })
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string;
}
