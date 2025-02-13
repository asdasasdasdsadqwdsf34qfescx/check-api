import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getData } from 'src/supa-api.service';
const cbApi =
  'https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=3YHSK';
@Injectable()
export class CheckService {
  @Cron(CronExpression.EVERY_MINUTE) // Runs every minute
  async checkCrom() {
    console.log('CRON START');
    const modelFromCb = [];
    try {
      const models = await getData();
      // Add your processing logic here
    } catch (error) {}
  }
}
