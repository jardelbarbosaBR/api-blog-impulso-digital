import { LoginUserDto } from './dto/loginuser.dto';
import { CreateUserDto } from './dto/createuser.dto';
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
  async signIn(LoginUserDto: LoginUserDto) {
    //Verificar se o usuario existe no banco de dados
    const user = await this.userRepository.findOne({
      where: {
        email: LoginUserDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    //Verifica a senha do usuario
    const isMastch = await bcrypt.compare(LoginUserDto.password, user.password);

    if (!isMastch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    //Retorna o token de acesso do usuario
    const payload = { sub: user.idUser, email: user.email };
    const token = await this.JWtService.signAsync(payload);
    return {
      access_token: token,
    };
  }

  //Registrar um novo usuario
  async signUp(userDto: CreateUserDto): Promise<CreateUserDto> {
    //Verificar se o usuario ja existe
    const findUser = await this.userRepository.findOne({
      where: {
        email: userDto.email,
      },
    });

    if (findUser) {
      throw new UnauthorizedException('Credencias inválidas');
    }
    //Criptografia da senha do usuario
    const hashPassword = await bcrypt.hash(userDto.password, 10);
    //Converte signUpDto para entidade User
    const user = new User();
    user.name = userDto.name;
    user.email = userDto.email;
    user.password = hashPassword;
    user.role = userDto.role;
    //Salva novo usuario no banco de dados com a senha criptografada
    const newUser = await this.userRepository.save(user);
    //Converte entidade User para SignUpDto
    const newUserDto = new CreateUserDto();
    newUserDto.name = newUser.name;
    newUserDto.email = newUser.email;
    newUserDto.role = newUser.role;
    //Retorna o novo usuario cadastrado no banco de dados
    return newUserDto;
  }
}
