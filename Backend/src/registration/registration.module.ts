import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TokenService } from '../token/token.service';
import { RegistrationService } from './registration.service';

@Module({
  imports: [RegistrationService, DatabaseService, TokenService],
})
export class RegistrationModule {}
