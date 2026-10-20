import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { BookingsModule } from './bookings/bookings.module.js';
import { AiModule } from './ai/ai.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, SessionsModule, BookingsModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}