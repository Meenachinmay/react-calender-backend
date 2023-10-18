import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { Request, Response } from 'express';
import { User } from 'src/types/user.type';
import { AuthenticatedGuard } from 'src/auth/central-auth/__auth-guards__/Guards';

const ZOOM_CLIENT_ID = 'OtIiNJsSSximkezfi4DvgQ';
const ZOOM_REDIRECT_URL = 'http://localhost:3000/zoom/callback';

@Controller('zoom')
export class ZoomController {
  constructor(private readonly zoomService: ZoomService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('/start')
  @Redirect(
    `https://zoom.us/oauth/authorize?response_type=code&client_id=${ZOOM_CLIENT_ID}&redirect_uri=${ZOOM_REDIRECT_URL}`,
  )
  startOAuth() {}

  @UseGuards(AuthenticatedGuard)
  @Get('/callback')
  async handleOAuthCallback(
    @Query('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const data = req.user as User;
    const tokens = await this.zoomService.handleOAuthCode(code, data.email);
    if (!tokens) {
      return res.redirect(
        `http://localhost:5173/zoom?error=Tokens from zoom not created`,
      );
    }
    return res.redirect(
      `http://localhost:5173/zoom?message=Zoom integration is successful!`,
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/create-meeting')
  async createZoomMeeting(
    @Body()
    body: { topic: string; date: string; time: string; endTime: string },
    @Req() req: Request,
  ) {
    // Extract user from the request (assuming you've set it up with Passport or any other authentication library)
    const user = req.user as User;

    const meetingDetails = await this.zoomService.createZoomMeeting(user, body);
    return meetingDetails;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/get-meetings')
  async getAllMeetingsForUser(@Req() req: Request) {
    const user = req.user as User;

    return await this.zoomService.getAllMeetingsForUser(user.email);
  }
}
