import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class DatetimeService {

  constructor() { }

  transformDate(date: string): string {
    const transformedDate = DateTime.fromISO(date);
    return transformedDate.toLocal().toLocaleString(DateTime.DATE_MED);
  }

  transformDateAndTime(date: string): string {
    const transformedDate = DateTime.fromISO(date);
    return transformedDate.toLocal().toLocaleString(DateTime.DATETIME_MED);
  }
}
