import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { MeetingController } from './meeting/meeting.controller';
import { MeetingService } from './meeting/meeting.service';
import { MeetingModule } from './meeting/meeting.module';
import { PrismaService } from './prisma-utils/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { ZoomController } from './zoom/zoom.controller';
import { ZoomService } from './zoom/zoom.service';
import { ZoomModule } from './zoom/zoom.module';

@Module({
  imports: [
    AuthModule,
    MeetingModule,
    PassportModule.register({ session: true }),
    ZoomModule,
  ],
  controllers: [
    AppController,
    AuthController,
    MeetingController,
    ZoomController,
  ],
  providers: [
    AppService,
    MeetingService,
    PrismaService,
    AuthService,
    ZoomService,
  ],
})
export class AppModule {}
