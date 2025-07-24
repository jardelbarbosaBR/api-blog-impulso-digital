import { signInDto } from './dto/signInDto.dto';
import { signUpDto } from './dto/signUpDto.dto';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entitys/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private JWtService: JwtService,
  ) {}

  //Login do usuario
  async signIn(data: signInDto) {
    //Verificar se o usuario existe no banco de dados
    const user = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    //Verifica a senha do usuario
    const isMastch = await bcrypt.compare(data.password, user.password);

    if (!isMastch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    //Retorna o token de acesso do usuario
    const payload = { sub: user.idUser, role: user.role };
    const token = await this.JWtService.signAsync(payload);
    return {
      access_token: token,
    };
  }

  //Registrar um novo usuario
  async signUp(data: signUpDto): Promise<signUpDto> {
    //Verificar se o usuario ja existe
    const findUser = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });

    if (findUser) {
      throw new UnauthorizedException('Credencias inválidas');
    }
    //Criptografia da senha do usuario
    const hashPassword = await bcrypt.hash(data.password, 10);
    //Converte signUpDto para entidade User
    const user = new User();
    user.name = data.name;
    user.email = data.email;
    user.password = hashPassword;
    user.role = data.role;
    //Salva novo usuario no banco de dados com a senha criptografada
    const newUser = await this.userRepository.save(user);
    //Converte entidade User para SignUpDto
    const newUserDto = new signUpDto();
    newUserDto.name = newUser.name;
    newUserDto.email = newUser.email;
    newUserDto.role = newUser.role;
    //Retorna o novo usuario cadastrado no banco de dados
    return newUserDto;
  }
}
