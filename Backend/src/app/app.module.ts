import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from '../token/token.module';
import { DatabaseService } from '../database/database.service';
import { TokenService } from '../token/token.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { RegistrationController } from '../registration/registration.controller';
import { RegistrationService } from '../registration/registration.service';
import { UserService } from '../user/user.service';
import { UserController } from '../user/user.controller';

@Module({
  imports: [TokenModule],
  controllers: [
    AppController,
    AuthController,
    RegistrationController,
    UserController,
  ],
  providers: [
    DatabaseService,
    TokenService,
    JwtService,
    AppService,
    AuthService,
    RegistrationService,
    UserService,
  ],
})
export class AppModule {}
