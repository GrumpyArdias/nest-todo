import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, mail, password } = createUserDto;
    const newUser = this.userRepository.create({
      name,
      mail,
      password,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'name', 'mail'],
    });
  }

  async findOne(id: number) {
    const { name, mail } = await this.userRepository.findOne({ where: { id } });
    return { name, mail };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { name, mail, password } = updateUserDto;
    await this.userRepository.update(id, {
      name,
      mail,
      password,
    });
    return `the user ${name} has been updated`;
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
    return `the user ${id} has been deleted`;
  }

  async findOneByEmail(mail: string) {
    return await this.userRepository.findOneBy({ mail });
  }
}
