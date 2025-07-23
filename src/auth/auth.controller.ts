import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createuser.dto';

import { LoginUserDto } from './dto/loginuser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() LoginUserDto: LoginUserDto) {
    return this.authService.signIn(LoginUserDto);
  }

  @Post('registro')
  async signUp(@Body() userDto: CreateUserDto) {
    const newUserDto = await this.authService.signUp(userDto);
    return {
      mensagem: 'Usuário cadastrado com sucesso',
      status: HttpStatus.CREATED,
      data: {
        name: newUserDto.name,
        email: newUserDto.email,
        role: newUserDto.role,
      },
    };
  }
}
