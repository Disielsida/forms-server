import {
  Body,
  Controller,
  Post,
  Request,
  Get,
  UnauthorizedException,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { jwtConstants } from './constants';

@ApiTags('api/v1/auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'login' })
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const data = await this.authService.login(email, password);

    if (!data) throw new UnauthorizedException();

    const { access_token } = data;

    response.cookie(jwtConstants.cookieName, access_token, {
      httpOnly: true,
      secure: true, // требуется для работы в https (на render.com — обязательно)
      sameSite: 'none', // иначе браузер заблокирует куку
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { message: 'Login successful' };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Logout user' })
  logout(@Res({ passthrough: true }) response: Response): { message: string } {
    response.clearCookie(jwtConstants.cookieName, {
      secure: true,
      sameSite: 'none',
    });

    return { message: 'Logout successful' };
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current profile' })
  @Get('me')
  getMe(@Request() req: ExpressRequest & { user?: unknown }): unknown {
    return req.user;
  }
}
