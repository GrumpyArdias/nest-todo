import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateToDoDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  text: string;

  @IsNotEmpty()
  @IsBoolean()
  closed: boolean;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;

  constructor(text: string, userId: number) {
    this.text = text;
    this.userId = userId;
    this.closed = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
