import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma-utils/prisma.service';
import { LocalStrategy } from './central-auth/__strategies__/LocalStrategy';
import { SessionSerializer } from './central-auth/__data-serialization__/Serializer';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
