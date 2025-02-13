import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getData } from './supa-api.service';
const cbApi =
  'https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=3YHSK';
@Injectable()
export class AppService {

}
