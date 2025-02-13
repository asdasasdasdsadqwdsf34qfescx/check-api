import { Module } from '@nestjs/common';
import { CheckModule } from './Check/check.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports:[CheckModule],
})
export class AppModule {}
