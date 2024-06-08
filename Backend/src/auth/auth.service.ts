import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuthDto } from './dto/auth.dto';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}
  async auth(dto: AuthDto) {
    const findUser = await this.databaseService.user.findFirst({
      where: {
        username: dto.username,
        password: dto.password,
      },
    });
    if (findUser) {
      const token = await this.tokenService.generateJwtToken(
        {
          username: findUser.username,
          password: findUser.password,
          id: findUser.id,
        },
        '20h',
      );
      return {
        token: token,
        user: findUser,
      };
    } else {
      throw new HttpException('Не удалось войти!', HttpStatus.NOT_FOUND);
    }
  }
}
