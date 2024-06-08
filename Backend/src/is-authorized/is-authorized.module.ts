import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';
import { isAuthorizedService } from './is-authorized.service';
import { DatabaseService } from '../database/database.service';

@Module({
  providers: [isAuthorizedService, DatabaseService, JwtService, TokenService],
})
export class IsAuthorizedModule {}
