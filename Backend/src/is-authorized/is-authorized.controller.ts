import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { isAuthorizedService } from './is-authorized.service';
@Controller('authorized')
export class IsAuthorizedContoller {
  constructor(private readonly isAuthorizedS: isAuthorizedService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async isAuthorized(@Res({ passthrough: true }) response, @Req() request) {
    return this.isAuthorizedS.token({ response, request });
  }
}
