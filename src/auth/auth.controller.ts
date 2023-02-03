import {
  Body,
  ConflictException,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(
    @Body() body: AuthDto,
  ): Promise<{ accessToken: string } | HttpException> {
    let user = undefined;
    try {
      user = await this.authService.validateUser(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() body: AuthDto): Promise<void | HttpException> {
    try {
      await this.authService.register(body);
    } catch (error) {
      if (error instanceof ConflictException)
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return;
  }

  @Get('checkToken')
  async checkToken(
    @Headers('Authorization') token: string,
  ): Promise<{ message: string } | HttpException> {
    if (await this.authService.isTokenExpired(token.split(' ').pop()))
      return { message: 'Token not expired' };
    else throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
  }
}
