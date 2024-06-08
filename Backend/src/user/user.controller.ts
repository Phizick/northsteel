import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUser(@Res({ passthrough: true }) response, @Req() request) {
    return this.userService.getUser({ response, request });
  }
}
