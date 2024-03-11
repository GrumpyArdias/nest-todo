import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { ToDoService } from './to-do.service';
import { CreateToDoDto } from './dto/create-to-do.dto';
import { UpdateToDoDto } from './dto/update-to-do.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('ToDo')
@Controller('to-do')
@ApiBearerAuth()
@ApiCreatedResponse({
  description: 'The ToDo has been successfully created.',
})
@ApiForbiddenResponse({ description: 'Forbidden.' })
@UseGuards(AuthGuard('jwt'), JwtStrategy)
export class ToDoController {
  constructor(private readonly toDoService: ToDoService) {}

  @Post()
  create(@Body() createToDoDto: CreateToDoDto, @Request() Req) {
    return this.toDoService.create(Req.user.sub, createToDoDto);
  }

  @Get('closed')
  findAllClosed(@Request() Req) {
    return this.toDoService.findAllClosed(Req.user.sub);
  }

  @Get()
  findAll(@Request() Req) {
    return this.toDoService.findAll(Req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() Req) {
    return this.toDoService.findOne(+id, Req.user.sub);
  }

  @Patch(':id')
  async updateToDo(
    @Param('id') id: number,
    @Body(new ValidationPipe({ skipMissingProperties: true }))
    updateToDoDto: UpdateToDoDto,
  ) {
    return this.toDoService.update(id, updateToDoDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toDoService.remove(+id);
  }
}
