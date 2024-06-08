import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseService } from '../database/database.service';
import { TokenService } from '../token/token.service';

@Module({
  imports: [AuthService, DatabaseService, TokenService],
})
export class AuthModule {}
