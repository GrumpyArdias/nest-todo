import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ password, mail, name }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(mail);

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await this.usersService.create({
      name,
      mail,
      password: hashedPassword,
    });

    return {
      message: 'User created successfully',
    };
  }

  async login({ mail, password }: LoginDto) {
    const user = await this.usersService.findOneByEmail(mail);

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { mail: user.mail, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
