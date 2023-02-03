import {
  IsNotEmpty,
  IsObject,
  IsPhoneNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2)
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @Length(10)
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Length(1)
  about: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address: AddressDto;
}
