import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ITokensPair } from './intefaces';
import { LoginDTO } from './dto/login.dto';
import { ERROR_MESSAGES } from 'src/common/constants';
import { QueryBuilderService } from 'src/common/services/queryBuilder.service';
import { JwtService } from '@nestjs/jwt';
import { IAuthorizedRequest } from 'src/common/interfaces/authorizeRequest.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly queryBuilderService: QueryBuilderService,
    private readonly jwtService: JwtService,
  ) { }

  public async login(loginDto: LoginDTO): Promise<ITokensPair> {
    try {
      const { email, password } = loginDto;

      const [foundUser] = await this.queryBuilderService.runQuery(
        `SELECT id, email, password FROM users WHERE email = $1 LIMIT 1`,
        [email],
      );

      if (!foundUser) {
        throw new UnauthorizedException(ERROR_MESSAGES.invalidCredentials);
      }

      const passwordsMatch = await bcrypt.compare(password, foundUser.password);

      if (passwordsMatch) {
        const { id, email } = foundUser;
        const accessToken = await this.jwtService.signAsync(
          { id, email },
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
            secret: process.env.ACCESS_TOKEN_SECRET,
          },
        );

        const refreshToken = await this.jwtService.signAsync(
          { id, email },
          {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
            secret: process.env.REFRESH_TOKEN_SECRET,
          },
        );

        return {
          accessToken,
          refreshToken,
        };
      }
      throw new UnauthorizedException(ERROR_MESSAGES.invalidCredentials);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(ERROR_MESSAGES.badRequest);
    }
  }

  public async generateRefreshToken(
    req: IAuthorizedRequest,
  ): Promise<ITokensPair> {
    try {
      const { id, email } = req.user;

      const accessToken = await this.jwtService.signAsync(
        { id, email },
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
          secret: process.env.ACCESS_TOKEN_EXPIRES,
        },
      );

      const refreshToken = await this.jwtService.signAsync(
        { id, email },
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
          secret: process.env.REFRESH_TOKEN_SECRET,
        },
      );
      return {
        accessToken,
        refreshToken,
      };
    } catch (_) {
      throw new BadRequestException(ERROR_MESSAGES.badRequest);
    }
  }
}
