import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.enity';
import { AuthDto } from './dto/auth.dto';
import { hash, verify } from 'argon2';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userDto: AuthDto): Promise<User | Error> {
    const user = await this.userService.findByEmail(userDto.email);
    if (!user) {
      throw new Error('User with provided email does not exist');
    }
    if (await verify(user.password, userDto.password)) {
      return user;
    }
    throw new Error('Incorrect password');
  }

  async login(user: User): Promise<{ accessToken: string }> {
    const payload = {
      username: user.email,
      sub: user.id,
    };
    const access_token = this.jwtService.sign(payload, { expiresIn: '24h' });
    user.token = access_token;
    await this.userService.save(user);
    return { accessToken: access_token };
  }

  async register(
    registerData: AuthDto,
  ): Promise<User | ConflictException | Error> {
    let user = new User();
    user.email = registerData.email;
    user.password = await hash(registerData.password);
    try {
      user = await this.userService.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError)
        throw new ConflictException('User with provided email already exists');
      throw new Error();
    }
    return user;
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}
