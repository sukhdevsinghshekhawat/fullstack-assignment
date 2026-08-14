import { IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * Optional input for POST /auth/guest.
 * A client may supply a session token to resume an existing guest session.
 * This keeps the flow simple while remaining extendable later.
 */
export class GuestLoginDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  sessionToken?: string;
}