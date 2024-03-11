import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import * as bcryptjs from 'bcryptjs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@ApiCreatedResponse({
  description: 'The User has been successfully created.',
})
@ApiForbiddenResponse({ description: 'Forbidden.' })
@UseGuards(AuthGuard('jwt'), JwtStrategy)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const hashedPassword = bcryptjs.hashSync(
      createUserDto.password,
      bcryptjs.genSaltSync(),
    );
    const { name, mail } = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return { name, mail };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
