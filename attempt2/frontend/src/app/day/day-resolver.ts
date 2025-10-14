import { ResolveFn } from '@angular/router';
import { inject, computed, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CalenderService } from '../calender';
import { DayData, Task } from '../calender-interface';
import { User } from '../user';

export type DayWithTaskNames = DayData & { tasks: (Task & { name?: string })[] };

export const dayResolver: ResolveFn<DayWithTaskNames | undefined> = (route) => {
  const calenderService = inject(CalenderService);
  const dateString = route.paramMap.get('date');
  const username = 'joe';

  console.log(dateString,username);
  

  if (!dateString || !username) {
    return undefined;
  }

  const paramDate = new Date(dateString);
  const paramDateUtc = new Date(Date.UTC(paramDate.getFullYear(), paramDate.getMonth(), paramDate.getDate()));
  
  // Convert the observable from the service into a signal
  const userSignal: Signal<User | undefined> = toSignal(calenderService.getUserByUsername(username),  { initialValue: undefined });
  console.log(userSignal);
  
  // Use a computed signal to perform the data processing
  const resolvedDay: Signal<DayWithTaskNames | undefined> = computed(() => {
    
    const currentUser = userSignal();
    console.log(currentUser?.username);

    if (!currentUser?.calendar) {
      return undefined;
    }

    const dayData = currentUser.calendar.calendarData.find((d: DayData) => {
      const calendarDateUtc = new Date(Date.UTC(d.date.getFullYear(), d.date.getMonth(), d.date.getDate()));
      return calendarDateUtc.getTime() === paramDateUtc.getTime();
    });

    if (!dayData) {
      console.warn(`No day data found for date: ${dateString}`);
      return undefined;
    }

    const mergedTasks = dayData.tasks.map(dayTask => {
      const taskDetails = currentUser.calendar.taskList.find(t => t.id === dayTask.id);
      return { ...dayTask, name: taskDetails?.name };
    });

    return {
      ...dayData,
      tasks: mergedTasks,
    };
  });

  // The resolver returns the signal's value, allowing Angular to handle its async nature
  return resolvedDay();
};
