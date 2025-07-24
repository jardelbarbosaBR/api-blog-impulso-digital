import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { signUpDto } from './dto/signUpDto.dto';
import { signInDto } from './dto/signInDto.dto';
import { AuthGuard } from './auth.guard';

import { Role } from 'src/enums/role.enum';
import { Roles } from './roles/roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: signInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('registro')
  async signUp(@Body() signUpDto: signUpDto) {
    const newUserDto = await this.authService.signUp(signUpDto);
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
