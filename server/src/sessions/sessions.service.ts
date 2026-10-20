import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { CreateSessionDto } from './dto/create-session.dto.js';

const MAX_DURATION_MIN = 180;
const minutes = (n: number) => n * 60 * 1000;

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSessionDto) {
    const startsAt = new Date(dto.startsAt);
    if (startsAt <= new Date()) {
      throw new BadRequestException('Session must be in the future');
    }

    const endsAt = new Date(startsAt.getTime() + minutes(dto.durationMin));

    // Overlap check: any session that starts before the new one ends
    // AND ends after the new one starts.
    const nearby = await this.prisma.session.findMany({
      where: {
        startsAt: {
          lt: endsAt,
          gt: new Date(startsAt.getTime() - minutes(MAX_DURATION_MIN)),
        },
      },
    });
    const overlaps = nearby.some(
      (s) => s.startsAt.getTime() + minutes(s.durationMin) > startsAt.getTime(),
    );
    if (overlaps) {
      throw new ConflictException('This time overlaps with another session');
    }

    return this.prisma.session.create({
      data: { startsAt, durationMin: dto.durationMin, type: dto.type },
    });
  }

  findAll(availableOnly: boolean) {
    return this.prisma.session.findMany({
      where: {
        startsAt: { gt: new Date() },
        ...(availableOnly && { booking: { is: null } }),
      },
      include: { booking: true },
      orderBy: { startsAt: 'asc' },
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.session.delete({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException('Session not found');
      }
      throw e;
    }
  }
}