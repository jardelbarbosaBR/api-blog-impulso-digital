import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...args: Role[]) => SetMetadata(ROLES_KEY, args);
