import { Injectable } from '@nestjs/common';
import { CreateToDoDto } from './dto/create-to-do.dto';
import { UpdateToDoDto } from './dto/update-to-do.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ToDo } from './entities/to-do.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ToDoService {
  constructor(
    @InjectRepository(ToDo) private toDoRepository: Repository<ToDo>,
  ) {}

  async create(createToDoDto: CreateToDoDto) {
    const newToDo = this.toDoRepository.create(createToDoDto);
    await this.toDoRepository.save(newToDo);
    return newToDo;
  }

  async findAll() {
    return await this.toDoRepository.find();
  }

  async findOne(id: number) {
    return await this.toDoRepository.findOne({ where: { id } });
  }

  async update(id: number, updateToDoDto: UpdateToDoDto) {
    const { text, closed } = updateToDoDto;
    await this.toDoRepository.update(id, { text, closed });
    return `The to do ${id} has been updated`;
  }

  async remove(id: number) {
    await this.toDoRepository.delete(id);
    return `The to do ${id} has been deleted`;
  }
  async findAllClosed() {
    return await this.toDoRepository.find({ where: { closed: true } });
  }
}
