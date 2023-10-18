import {
  IsString,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateMeetingDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsNotEmpty()
  @IsString()
  zoomUrl: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}

export class UpdateMeetingDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  zoomUrl?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsInt()
  userId?: number;
}
