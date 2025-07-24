import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtConstants } from './constants/jwtConstants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jetService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extrairToken(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jetService.verifyAsync(token, {
        secret: JwtConstants.secret,
      });

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extrairToken(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
