import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async book(sessionId: string, dto: CreateBookingDto) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    if (session.startsAt <= new Date()) {
      throw new BadRequestException('This session has already started');
    }

    try {
      return await this.prisma.booking.create({
        data: { ...dto, sessionId },
        include: { session: true },
      });
    } catch (e) {
      // P2002 = unique constraint failed → sessionId already has a booking
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Sorry, this session was just booked by someone else');
      }
      throw e;
    }
  }
}