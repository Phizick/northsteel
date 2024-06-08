import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationDto } from './dto/registration.dto';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}
  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(HttpStatus.OK)
  async auth(@Body() dto: RegistrationDto) {
    return this.registrationService.registration(dto);
  }
}
