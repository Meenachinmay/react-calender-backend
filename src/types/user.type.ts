import { Meeting } from "@prisma/client";

export interface User {
  id: number;
  email: string;
  meetings: Meeting[] | null;
  zoomAccessToken: string;
  zoomRefreshToken: string;
}
