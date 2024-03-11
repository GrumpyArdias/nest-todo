import { PartialType } from '@nestjs/mapped-types';
import { CreateToDoDto } from './create-to-do.dto';
import {
  IsOptional,
  Length,
  IsString,
  IsBoolean,
  IsDate,
  IsNotEmpty,
} from 'class-validator';

export class UpdateToDoDto extends PartialType(CreateToDoDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  text?: string;

  @IsOptional()
  @IsBoolean()
  closed: boolean;

  @IsDate()
  updatedAt: Date;
}
