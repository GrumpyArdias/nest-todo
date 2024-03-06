import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  mail: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;

  constructor(name: string, mail: string, password: string) {
    this.name = name;
    this.mail = mail;
    this.password = password;
  }
}
