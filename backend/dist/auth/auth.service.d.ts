import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private users;
    private jwt;
    constructor(users: UsersService, jwt: JwtService);
    validateAndLogin(username: string, password: string): Promise<{
        accessToken: string;
        role: import("../users/user.schema").Role;
    }>;
}
