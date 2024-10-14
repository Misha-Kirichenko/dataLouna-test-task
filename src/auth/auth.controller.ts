import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ITokensPair } from './intefaces';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateAuthDocs } from './docs/controller.decorator';
import { LOGIN_DECORATORS, REFRESH_DECORATORS } from './docs';
import { RefreshAuthGuard } from './guards/refreshAuth.guard';
import { IAuthorizedRequest } from 'src/common/interfaces/authorizeRequest.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @CreateAuthDocs(LOGIN_DECORATORS)
  @Post('/login')
  login(@Body() loginDto: LoginDTO): Promise<ITokensPair> {
    return this.authService.login(loginDto);
  }

  @CreateAuthDocs(REFRESH_DECORATORS)
  @UseGuards(RefreshAuthGuard)
  @Get('/refresh')
  refresh(@Req() req: IAuthorizedRequest): Promise<ITokensPair> {
    return this.authService.generateRefreshToken(req);
  }
}
