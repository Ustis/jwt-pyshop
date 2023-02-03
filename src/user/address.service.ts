import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async update(address: Address): Promise<UpdateResult> {
    return this.addressRepository.update(address.id, address);
  }
}
