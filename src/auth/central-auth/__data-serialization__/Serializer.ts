import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/types/user.type';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-utils/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  serializeUser(user: any, done: Function) {
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
    });
    return userDb ? done(null, userDb) : done(null, null);
  }
}
