import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { extractTokenFromHeader } from '../utils';
import { ITokenPayload } from 'src/auth/intefaces';

@Injectable()
export class BaseAuthGuard implements CanActivate {
  private readonly jwtService: JwtService;
  private secret: string;
  constructor(secret: string) {
    this.jwtService = new JwtService();
    this.secret = secret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let payload: ITokenPayload;

    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request, 'Bearer');

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.secret,
      });
    } catch (_) {
      throw new UnauthorizedException();
    }

    request['user'] = payload;

    return true;
  }
}
