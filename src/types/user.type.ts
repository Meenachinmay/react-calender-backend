import { Meeting } from '@prisma/client';

export interface User {
  email: string;
  meetings: Meeting[] | null;
  zoomAccessToken: string;
  zoomRefreshToken: string;
}
