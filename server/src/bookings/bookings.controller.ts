import { Body, Controller, Param, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Controller('sessions')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post(':id/book')
  book(@Param('id') id: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.book(id, dto);
  }
}