import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionGuard } from './guards/session.guard';
import { UsersModule } from '../users/users.module';
import { SessionRepository } from './session.repository';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, SessionGuard, SessionRepository],
  exports: [SessionGuard, SessionRepository],
})
export class AuthModule {}
