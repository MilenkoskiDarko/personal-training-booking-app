import { IsDateString, IsEnum, IsInt, Max, Min } from 'class-validator';
import { SessionType } from '../../generated/prisma/client.js';

export class CreateSessionDto {
  @IsDateString()
  startsAt!: string; // e.g. "2026-10-25T10:00:00"

  @IsInt()
  @Min(15)
  @Max(180)
  durationMin!: number;

  @IsEnum(SessionType)
  type!: SessionType; // ASSESSMENT | TRAINING | ONLINE
}