import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/types/user.type';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-utils/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  serializeUser(user: User, done: Function) {
    done(null, user);
  }

  async deserializeUser(user: User, done: Function) {
    if (!user || !user.email) {
      return done(null, false);
    }

    const userDb = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
      include: {
        meetings: true,
      },
    });

    type UserPreview = Omit<User, 'password'>;

    const _user: UserPreview = {
      id: user.id,
      email: user.email,
      meetings: user.meetings,
      zoomAccessToken: user.zoomAccessToken,
      zoomRefreshToken: user.zoomRefreshToken,
    };

    return userDb ? done(null, _user) : done(null, null);
  }
}
