import { Module } from '@nestjs/common';
import { CheckModule } from './Check/check.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RecModule } from './Rec/Rec.module';

@Module({
  imports:[CheckModule,RecModule],
})
export class AppModule {}
