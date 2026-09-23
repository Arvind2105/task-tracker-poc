import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException({ message: 'Incorrect username.' });
    }

    const isPasswordMatch = await (user as any).comparePassword(password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException({ message: 'Incorrect password.' });
    }

    return user;
  }
}
