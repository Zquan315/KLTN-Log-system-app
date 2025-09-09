import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('admin'|'read')[]) => SetMetadata(ROLES_KEY, roles);
