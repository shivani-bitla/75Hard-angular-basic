// src/app/day.resolver.ts
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { GenerateCalenderService } from './generate-calender';
import { DayData } from './days-calender';
import { map } from 'rxjs';

export const dayResolver: ResolveFn<DayData | undefined> = (route, state) => {
  const calenderService = inject(GenerateCalenderService);
  const dateString = route.paramMap.get('date');

  return calenderService.calendarData$.pipe(
    map(calendar => {
      if (calendar && dateString) {
        return calendar.calendarData.find(d => {
          const [dayDate] = new Date(d.date).toISOString().split('T');
          return dayDate === dateString;
        });
      }
      return undefined;
    })
  );
};
