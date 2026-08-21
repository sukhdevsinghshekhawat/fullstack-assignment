import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
    try {
      const cookieToken = (req.cookies?.[SESSION_COOKIE] as string) ?? undefined;
      const bodyToken = dto.sessionToken;

      // Prefer an existing cookie; fall back to an explicit token from the body.
      const existingToken = cookieToken ?? bodyToken;

      const { user, sessionToken } = await this.authService.loginAsGuest(
        existingToken,
      );

      // Determine the request origin (fall back to FRONTEND_URLS first value)
      const reqOrigin = (req.get('origin') as string) || (process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL ?? 'http://localhost:3000').split(',')[0];
      const isReqHttps = reqOrigin.startsWith('https://');

      // If the request origin is an HTTPS frontend (e.g., Netlify), we must
      // set SameSite=None and Secure to allow cross-site cookies. For local
      // HTTP development, use SameSite=Lax.
      res.cookie(SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        sameSite: isReqHttps ? 'none' : 'lax',
        secure: isReqHttps || process.env.NODE_ENV === 'production',
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
        // send detailed info for debugging (only when DEBUG=true)
        return res.status(500).json(body);
      }

      // Generic error for normal operation
      return res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
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
    // Cookie options:
    // - `httpOnly`: keep the token out of JavaScript (XSS-safe).
    // - `sameSite`: when the frontend is served from a different origin
    //   (e.g., Netlify on HTTPS), we must use `None` and `secure: true`
    //   for the browser to send the cookie cross-site.
    // - `secure`: required when `sameSite: 'none'`; enable when using HTTPS.
    // Determine the request origin (fall back to FRONTEND_URLS first value)
    const reqOrigin = (req.get('origin') as string) || (process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL ?? 'http://localhost:3000').split(',')[0];
    const isReqHttps = reqOrigin.startsWith('https://');

    // If the request origin is an HTTPS frontend (e.g., Netlify), we must
    // set SameSite=None and Secure to allow cross-site cookies. For local
    // HTTP development, use SameSite=Lax.
    res.cookie(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: isReqHttps ? 'none' : 'lax',
      secure: isReqHttps || process.env.NODE_ENV === 'production',
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
  }
}
