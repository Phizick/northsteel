import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RegistrationDto } from './dto/registration.dto';
import { TokenService } from '../token/token.service';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  async registration(dto: RegistrationDto) {
    const findUser = await this.databaseService.user.findFirst({
      where: {
        username: dto.username,
      },
    });
    if (!findUser) {
      const createUser = await this.databaseService.user.create({
        data: {
          username: dto.username,
          password: dto.password,
        },
      });
      const token = await this.tokenService.generateJwtToken(
        {
          username: createUser.username,
          password: createUser.password,
          id: createUser.id,
        },
        '20h',
      );
      return {
        token: token,
        user: createUser,
      };
    } else {
      throw new HttpException(
        'Пользователь зарегистрирован!',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
