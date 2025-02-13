import { Module } from '@nestjs/common';
import {  RecursiveService } from './Rec.service';

@Module({
  providers: [RecursiveService],
  exports: [RecursiveService],
})
export class RecModule {}
