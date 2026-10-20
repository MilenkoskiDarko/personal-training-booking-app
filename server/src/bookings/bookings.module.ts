import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';
import { AiModule } from '../ai/ai.module.js';

@Module({
  imports: [AiModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}