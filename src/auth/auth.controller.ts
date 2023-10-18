import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthenticatedGuard,
  LocalAuthGuard,
} from './central-auth/__auth-guards__/Guards';
import { CreateUserDto } from 'src/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly centralAuthService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req, @Res() res): Promise<string> {
    if (req.isAuthenticated()) {
      return res.status(200).send('loggedin', HttpStatus.OK);
    }
  }

  @Post('sign-up')
  signUp(@Body() user: CreateUserDto) {
    return this.centralAuthService.createUser(user);
  }

  @Post('logout')
  logout(@Req() req, @Res() res): Promise<string> {
    return req.logout(() => {
      req.session.destroy((err) => {
        if (err) {
          // handle error
          return res.status(500).send({ msg: 'Error logging out' });
        }
        res.clearCookie('connect.sid', { path: '/' }); // If you're using the default session cookie name
        return res.status(200).send({ msg: 'Logged out successfully' });
      });
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/get-auth-status')
  checkAuth() {
    return { msg: 'OK' };
  }
}
