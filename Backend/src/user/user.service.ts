import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/token/token.service';
import { Request, Response } from 'express';
import * as process from 'process';

interface IUser {
  id: string;
}

@Injectable()
export class UserService {
  constructor(
    private readonly dataBaseService: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  async getUser(data: { response: Response; request: Request }) {
    try {
      data.response.setHeader(
        'Access-Control-Allow-Origin',
        `${process.env.CORS_DOMEN}`,
      );
      data.response.setHeader('Access-Control-Allow-Credentials', 'true');
      const decodeUser = (await this.tokenService.verifyToken(
        data.request.cookies.token,
      )) as IUser;
      const findUser = await this.dataBaseService.user.findFirst({
        where: {
          id: decodeUser.id,
        },
      });

      if (!findUser) {
        throw new HttpException(
          'Пользователь не найден!',
          HttpStatus.NOT_FOUND,
        );
      }
      return findUser;
    } catch (error) {
      throw new HttpException('Авторизуйтесь!', HttpStatus.UNAUTHORIZED);
    }
  }
}
