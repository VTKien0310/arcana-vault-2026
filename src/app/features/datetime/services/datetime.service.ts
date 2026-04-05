import {Injectable} from '@angular/core';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable({providedIn: 'root'})
export class DatetimeService {
  utcToLocalInFormat(utcDateTime: string, format = 'MMM D, YYYY, h:mm A'): string {
    return dayjs.utc(utcDateTime).local().format(format);
  }
}
