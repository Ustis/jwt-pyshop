import { IsNotEmpty, IsString } from 'class-validator';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  administrativeArea: string;

  @IsNotEmpty()
  @IsString()
  locality: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  premise: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;
}
