import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as process from 'process';
import { Injectable } from '@nestjs/common';

interface IUser {
  id: string;
  username: string;
  password: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY_JWT,
    });
  }
  async validate(payload: { user: IUser }) {
    return { ...payload.user };
  }
}
