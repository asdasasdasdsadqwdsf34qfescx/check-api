import { Module } from '@nestjs/common';
import {  CheckService } from './check.service';

@Module({
  exports:[CheckService],
  providers:[CheckService]
})
export class CheckModule {}
