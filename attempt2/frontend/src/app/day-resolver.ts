// src/app/day/day.resolver.ts
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { GenerateCalenderService } from './generate-calender';
import { DayData, DaysCalender, Task, TaskList } from './days-calender';
import { take, map } from 'rxjs/operators';

export type DayWithTaskNames = DayData & { tasks: (Task & { name?: string })[] };

export const dayResolver: ResolveFn<DayWithTaskNames | undefined> = (route, state) => {
  console.log('Day resolver invoked with route:', route); // Debug log
  const calenderService = inject(GenerateCalenderService);
  const dateString = route.paramMap.get('date') ?? new Date().toISOString().split('T')[0];

  return calenderService.calendarData$.pipe(
    take(1),
    map((calendar: DaysCalender | null) => {
      console.log('Calendar observable accessed'); // Debug log
      console.log('Calendar data:', calendar); // Debug log
      if (!calendar) {
        return undefined;
      }
      console.log('Looking for date:', dateString); // Debug log
      // Find the specific DayData object for the given date
      const dayData = calendar.calendarData.find(d => {
        const [dayDate] = new Date(d.date).toISOString().split('T');
        // dateString is guaranteed to be a string here
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
