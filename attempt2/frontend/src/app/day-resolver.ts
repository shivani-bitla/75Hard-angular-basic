// src/app/day/day.resolver.ts
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { GenerateCalenderService } from './generate-calender'; // Assuming correct path
import { DayData, DaysCalender, Task } from './days-calender';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, filter, take, first } from 'rxjs/operators';

export type DayWithTaskNames = DayData & { tasks: (Task & { name?: string })[] };

export const dayResolver: ResolveFn<DayWithTaskNames | undefined> = (route, state) => {
  const calenderService = inject(GenerateCalenderService);
  const dateString = route.paramMap.get('date');
  console.log('Resolver called for date:', dateString);
  const dayStringDate = new Date( Date.parse(dateString || ''));
  dayStringDate.setHours(0, 0, 0, 0);
  console.log('Parsed date:', (dayStringDate));
  console.log('Parsed date:', (dayStringDate.toISOString()));


  return toObservable(calenderService.calendarState).pipe(
    filter(calendar => calendar !== null), // Wait for the signal to have a value
    first(),
    map((calendar: DaysCalender) => {
      
      if (!calendar || !dateString) {
        return undefined;
      }
      console.log('Calendar data:', calendar);
      

      const dayData = calendar.calendarData.find(d => {    
        if(d.date.toString()==dayStringDate.toString()){
          return  d.date.toString()==dayStringDate.toString();
        }else{
          return d.date.toString()===dateString
        }                          
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
