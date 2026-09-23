import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedGuard } from './authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.authService.register(body.username, body.password);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req) {
    return new Promise((resolve, reject) => {
      req.logIn(req.user, (err) => {
        if (err) return reject(err);
        resolve({
          message: 'Logged in successfully',
          user: { id: req.user._id, username: req.user.username },
        });
      });
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('status')
  async status(@Req() req) {
    return {
      isAuthenticated: true,
      user: { id: req.user._id, username: req.user.username },
    };
  }

  @Post('logout')
  async logout(@Req() req) {
    return new Promise((resolve, reject) => {
      req.logout((err: any) => {
        if (err) return reject(err);
        resolve({ message: 'Logged in successfully' }); // or 'Logged out successfully'
      });
    });
  }
}
