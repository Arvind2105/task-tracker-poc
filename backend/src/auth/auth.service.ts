import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(username: string, password: string) {
    const user = await this.usersService.create(username, password);
    return { id: user._id, username: user.username };
  }
}
