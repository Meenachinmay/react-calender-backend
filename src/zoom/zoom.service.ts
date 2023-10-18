import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma-utils/prisma.service';
import { User } from 'src/types/user.type';
// ... (other imports you might need, like PrismaService for saving tokens)

@Injectable()
export class ZoomService {
  // Inject necessary services (e.g., PrismaService) via constructor
  constructor(private readonly prismaService: PrismaService) {}

  async handleOAuthCode(code: string, userEmail: string) {
    const tokens = await this.getTokensFromCode(code);

    // Save tokens to your user's record in the database
    // await this.prismaService.user.update({ where: { id: yourUserId }, data: { zoomAccessToken: tokens.accessToken, zoomRefreshToken: tokens.refreshToken } });
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      throw new HttpException(
        'User not found while handling OAuth process from zoom',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prismaService.user.update({
      where: {
        email: userEmail,
      },
      data: {
        zoomAccessToken: tokens.accessToken,
        zoomRefreshToken: tokens.refreshToken,
      },
    });

    return tokens;
  }

  private async getTokensFromCode(code: string) {
    const tokenResponse = await axios.post(
      'https://zoom.us/oauth/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'http://localhost:3000/zoom/callback',
        },
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              'OtIiNJsSSximkezfi4DvgQ:5o0UNtXIYFPmHXnZX53VRB4SiS884O8x',
            ).toString('base64'),
        },
      },
    );

    const { access_token, refresh_token } = tokenResponse.data;
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }

  async createZoomMeeting(
    user: User,
    meetingDetails: { topic: string; date: string; time: string },
  ) {
    const { topic, date, time } = meetingDetails;

    // Format date and time to match Zoom's requirements
    const formattedDate = `${date}T${time}:00Z`; // Example: "2023-10-18T09:00:00Z"

    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic,
        type: 2, // Scheduled meeting
        start_time: formattedDate,
      },
      {
        headers: {
          Authorization: `Bearer ${user.zoomAccessToken}`, // Assuming you've saved Zoom's access token with the user record.
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      zoomMeetingURL: response.data.join_url,
      topic: response.data.topic,
    };
  }
}
