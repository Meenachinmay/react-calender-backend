import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { User } from 'src/types/user.type';
import { AuthService } from './auth.service';
import {
  AuthenticatedGuard,
  LocalAuthGuard,
} from './central-auth/__auth-guards__/Guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly centralAuthService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req, @Res() res): User {
    if (req.isAuthenticated()) {
      // Return user data as JSON object
      return res.status(200).json({
        status: 'loggedin',
        user: req.user, // send the authenticated user data
      });
    } else {
      // In case of failure, you can send a suitable response (optional)
      return res.status(401).json({
        status: 'error',
        message: 'Authentication failed',
      });
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
