import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './user.enity';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { DeleteResult } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async create(
    @Headers('Authorization') token: string,
    @Body() userDto: UserDto,
  ): Promise<User | HttpException> {
    const user = await this.userService.findByToken(token.split(' ').pop());
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(user, userDto);

    return this.userService.save(user).then((user) => user.filterKeys());
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  async get(
    @Headers('Authorization') token: string,
  ): Promise<User | HttpException> {
    const user = await this.userService.findByToken(token.split(' ').pop());
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user.filterKeys();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async updateUserData(
    @Headers('Authorization') token: string,
    @Body() userDto: UserDto,
  ): Promise<User | HttpException> {
    const user = await this.userService.findByToken(token.split(' ').pop());
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.address == null) {
      Object.assign(user, userDto);
      return this.userService.save(user).then((user) => user.filterKeys());
    }

    // Object.assign loses address.id, we need to reasign it
    const addressId = user.address.id;
    Object.assign(user, userDto);
    user.address.id = addressId;

    return this.userService
      .update(user)
      .then(() => {
        return this.userService.find(user.id).then((user) => user.filterKeys());
      })
      .catch(() => {
        throw new HttpException('Data update error', HttpStatus.NOT_MODIFIED);
      });
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async delete(
    @Headers('Authorization') token: string,
  ): Promise<DeleteResult | HttpException> {
    const user = await this.userService.findByToken(token.split(' ').pop());
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.userService.delete(user);
  }
}
