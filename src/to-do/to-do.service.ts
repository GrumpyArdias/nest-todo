import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async create(userId: number, createToDoDto: CreateToDoDto) {
    const newCreateToDoDto = new CreateToDoDto(createToDoDto.text, userId);
    const newToDo = this.toDoRepository.create(newCreateToDoDto);
    await this.toDoRepository.save(newToDo);
    return newToDo;
  }

  async findAll(userId: number) {
    const toDos = await this.toDoRepository
      .createQueryBuilder('toDo')
      .leftJoinAndSelect('toDo.user', 'user')
      .select([
        'toDo.id',
        'toDo.text',
        'toDo.closed',
        'toDo.createdAt',
        'toDo.updatedAt',
        'user.id',
        'user.name',
      ])
      .where('user.id = :userId', { userId })
      .getMany();

    return toDos;
  }

  async findOne(toDoId: number, userId: number) {
    const toDo = await this.toDoRepository
      .createQueryBuilder('toDo')
      .leftJoinAndSelect('toDo.user', 'user')
      .select([
        'toDo.id',
        'toDo.text',
        'toDo.closed',
        'toDo.createdAt',
        'toDo.updatedAt',
        'user.id',
        'user.name',
      ])
      .where('toDo.id = :toDoId', { toDoId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    if (!toDo) {
      throw new NotFoundException(`ToDo with ID ${toDoId} not found`);
    }

    return toDo;
  }
  async update(userId: number, id: number, updateToDoDto: UpdateToDoDto) {
    const toDo = await this.toDoRepository.findOneBy({ id });

    if (!toDo) {
      throw new NotFoundException(`ToDo with ID ${id} not found`);
    }

    if (toDo.user.id !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to update this to-do.`,
      );
    }

    const updateData = {};
    if (updateToDoDto.hasOwnProperty('text')) {
      updateData['text'] = updateToDoDto.text;
    }
    if (updateToDoDto.hasOwnProperty('closed')) {
      updateData['closed'] = updateToDoDto.closed;
    }

    if (Object.keys(updateData).length > 0) {
      await this.toDoRepository.update(id, updateData);
    } else {
      throw new BadRequestException('No valid fields provided for update');
    }

    return `The to-do ${id} has been updated`;
  }

  async remove(userId: number, id: number) {
    const result = await this.toDoRepository.delete({
      id,
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `ToDo with ID ${id} not found or you are not the owner.`,
      );
    }

    return `The to-do ${id} has been deleted`;
  }
  async findAllClosed(userId: number) {
    const toDos = await this.toDoRepository
      .createQueryBuilder('toDo')
      .leftJoinAndSelect('toDo.user', 'user')
      .select([
        'toDo.id',
        'toDo.text',
        'toDo.closed',
        'toDo.createdAt',
        'toDo.updatedAt',
        'user.id',
        'user.name',
      ])
      .where('user.id = :userId', { userId })
      .andWhere('toDo.closed = :closed', { closed: true })
      .getMany();

    return toDos;
  }
}
