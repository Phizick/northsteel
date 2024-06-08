import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as process from 'process';
import { DatabaseService } from '../database/database.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class isAuthorizedService {
  constructor(
    private readonly dataBase: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}
  async token(data: { response: Response; request: Request }) {
    try {
      data.response.setHeader(
        'Access-Control-Allow-Origin',
        `${process.env.CORS_DOMEN}`,
      );
      data.response.setHeader('Access-Control-Allow-Credentials', 'true');
      const decodeUser = await this.tokenService.verifyToken(
        data.request.cookies.token,
      );
      const findUser = await this.dataBase.user.findFirst({
        where: {
          id: decodeUser.id,
        },
      });
      if (findUser) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Авторизован',
        };
      } else {
        throw new HttpException('Авторизуйтесь!', HttpStatus.UNAUTHORIZED);
      }
    } catch (err) {
      throw new HttpException('Авторизуйтесь!', HttpStatus.UNAUTHORIZED);
    }
  }
}
