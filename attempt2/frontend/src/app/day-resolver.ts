// src/app/day/day.resolver.ts
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { GenerateCalenderService } from './generate-calender';
import { DayData, DaysCalender, Task } from './days-calender';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// This is the combined type that the component will use
export type DayWithTaskNames = DayData & { tasks: (Task & { name?: string })[] };

export const dayResolver: ResolveFn<DayWithTaskNames | undefined> = (route, state) => {
  const calenderService = inject(GenerateCalenderService);
  const dateString = route.paramMap.get('date');

  return calenderService.calendarData$.pipe(
    map((calendar: DaysCalender | null) => {
      if (!calendar || !dateString) {
        return undefined;
      }

      // Find the specific DayData object for the given date
      const dayData = calendar.calendarData.find(d => {
        const [dayDate] = new Date(d.date).toISOString().split('T');
        return dayDate === dateString;
      });

      if (!dayData) {
        return undefined;
      }

      // Merge the DayData tasks with the TaskList names
      const mergedTasks = dayData.tasks.map(dayTask => {
        const taskDetails = calendar.taskList.find(t => t.id === dayTask.id);
        return {
          ...dayTask,
          name: taskDetails?.name,
        };
      });

      // Combine the original day data with the new merged tasks
      return {
        ...dayData,
        tasks: mergedTasks,
      };
    })
  );
};
