import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.enity';
import { AddressService } from './address.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly addressService: AddressService,
  ) {}

  async find(userId: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async save(user: User): Promise<User | undefined> {
    return this.usersRepository.save(user);
  }

  async update(user: User) {
    //Update nested
    this.addressService.update(user.address).catch((error) => {
      throw error;
    });
    delete user.address;

    return this.usersRepository.update(user.id, user);
  }

  async delete(user: User): Promise<DeleteResult> {
    return this.usersRepository.delete(user.id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email: email } });
  }

  async findByToken(token: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { token: token } });
  }
}
