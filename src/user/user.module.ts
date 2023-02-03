import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.enity';
import { Address } from './address.entity';
import { AddressService } from './address.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  providers: [UserService, AddressService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
