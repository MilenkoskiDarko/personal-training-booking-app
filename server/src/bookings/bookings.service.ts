import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AiService } from '../ai/ai.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  async book(sessionId: string, dto: CreateBookingDto) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    if (session.startsAt <= new Date()) {
      throw new BadRequestException('This session has already started');
    }

    return this.createBooking(sessionId, dto);
  }

  async confirmationMessage(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { session: true },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Already generated before? Return it instead of calling Gemini again.
    if (booking.aiMessage) {
      return { message: booking.aiMessage };
    }

    const message = await this.ai.bookingConfirmation({
      name: booking.name,
      type: booking.session.type,
      goal: booking.goal,
      startsAt: booking.session.startsAt,
      durationMin: booking.session.durationMin,
      note: booking.note,
    });

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { aiMessage: message },
    });

    return { message };
  }

  private async createBooking(sessionId: string, dto: CreateBookingDto) {
    try {
      return await this.prisma.booking.create({
        data: { ...dto, sessionId },
        include: { session: true },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Sorry, this session was just booked by someone else');
      }
      throw e;
    }
  }
}