// src/app/day/day.resolver.ts
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { GenerateCalenderService } from './generate-calender'; // Assuming correct path
import { DayData, DaysCalender, Task } from './days-calender';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, filter, take } from 'rxjs/operators';

export type DayWithTaskNames = DayData & { tasks: (Task & { name?: string })[] };

export const dayResolver: ResolveFn<DayWithTaskNames | undefined> = (route, state) => {
  const calenderService = inject(GenerateCalenderService);
  const dateString = route.paramMap.get('date');

  return toObservable(calenderService.calendarState).pipe(
    filter(calendar => calendar !== null), // Wait for the signal to have a value
    take(1), // Complete the observable after the first emission
    map((calendar: DaysCalender) => {
      if (!calendar || !dateString) {
        return undefined;
      }

      const dayData = calendar.calendarData.find(d => {
        const [dayDate] = d.date.toISOString().split('T');
        return dayDate === dateString;
      });

      if (!dayData) {
        return undefined;
      }

      const mergedTasks = dayData.tasks.map(dayTask => {
        const taskDetails = calendar.taskList.find(t => t.id === dayTask.id);
        return { ...dayTask, name: taskDetails?.name };
      });

      return {
        ...dayData,
        tasks: mergedTasks,
      };
    })
  );
};
