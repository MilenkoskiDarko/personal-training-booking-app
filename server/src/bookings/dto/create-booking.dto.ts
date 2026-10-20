import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Goal } from '../../generated/prisma/client.js';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsEnum(Goal)
  goal!: Goal; // STRENGTH | WEIGHT_LOSS | MOBILITY | GENERAL

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}