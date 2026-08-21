import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GuestLoginDto } from './dto';
import { SESSION_COOKIE } from './guards/session.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  getMe(@Req() req: Request) {
    const anyReq = req as any;
    return { user: anyReq.user ?? null };
  }

  @Post('guest')
  @HttpCode(HttpStatus.OK)
  async guestLogin(
    @Body() dto: GuestLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const cookieToken = (req.cookies?.[SESSION_COOKIE] as string) ?? undefined;
      const bodyToken = dto.sessionToken;

      // Prefer an existing cookie; fall back to an explicit token from the body.
      const existingToken = cookieToken ?? bodyToken;

      const { user, sessionToken } = await this.authService.loginAsGuest(
        existingToken,
      );

      // Determine the request origin (fall back to FRONTEND_URLS first value)
      const reqOrigin = (req.get('origin') as string) ||
        (process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL ?? 'http://localhost:3000').split(',')[0];
      const isReqHttps = reqOrigin.startsWith('https://');

      // Allow cross-site cookies for HTTPS frontends and local development
      // (localhost). For cross-site cookies we must set `SameSite=None` and
      // `Secure`. Setting `Secure=true` is fine because the response is
      // delivered over HTTPS from Render; browsers will send the cookie on
      // subsequent HTTPS requests from the page even if the page itself is
      // served over HTTP during local development.
      const allowCrossSite = isReqHttps || reqOrigin.includes('localhost');
      const cookieSameSite: 'none' | 'lax' = allowCrossSite ? 'none' : 'lax';
      const cookieSecure = allowCrossSite || process.env.NODE_ENV === 'production';

      res.cookie(SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        sameSite: cookieSameSite,
        secure: cookieSecure,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/',
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          fullName: user.fullName,
          title: user.title,
          username: user.username,
          avatarUrl: user.avatarUrl,
          isGuest: user.isGuest,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        message: 'Guest login successful',
      };
    } catch (err) {
      // Log server-side for diagnostics
      // eslint-disable-next-line no-console
      console.error('Guest login failed:', err);

      // If DEBUG=true, return the error message and stack in the response
      if (process.env.DEBUG === 'true') {
        const body: any = { statusCode: 500, message: 'Internal server error' };
        if (err instanceof Error) {
          body.error = err.message;
          body.stack = err.stack;
        } else {
          body.error = String(err);
        }
        return res.status(500).json(body);
      }

      return res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
  }
}
