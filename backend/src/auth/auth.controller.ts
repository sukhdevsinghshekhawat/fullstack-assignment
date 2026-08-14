import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GuestLoginDto } from './dto/guest-login.dto';
import { SESSION_COOKIE } from './guards/session.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/guest
   *
   * Creates (or resumes) a guest session and stores the session
   * token in an HTTP-only cookie. The cookie is not readable from
   * client-side JavaScript, which keeps the token safe from XSS.
   */
  @Post('guest')
  @HttpCode(HttpStatus.OK)
  async guestLogin(
    @Body() dto: GuestLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieToken = (req.cookies?.[SESSION_COOKIE] as string) ?? undefined;
    const bodyToken = dto.sessionToken;

    // Prefer an existing cookie; fall back to an explicit token from the body.
    const existingToken = cookieToken ?? bodyToken;

    const { user, sessionToken } = await this.authService.loginAsGuest(
      existingToken,
    );

    // Secure, HTTP-only, same-site cookie so the browser sends it
    // automatically on subsequent requests. `secure` is only enabled
    // when NODE_ENV is production (HTTPS).
    res.cookie(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isGuest: user.isGuest,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: 'Guest login successful',
    };
  }
}