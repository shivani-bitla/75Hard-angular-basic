import { ResolveFn } from '@angular/router';
import { computed, inject, Signal } from '@angular/core';
import { CalenderService } from '../calender';
import { TaskList } from '../calender-interface';
import { User } from '../user';
import { toSignal } from '@angular/core/rxjs-interop';

// The return type should be an array of TaskList objects

export const goalsResolver: ResolveFn<TaskList[] | undefined> = (route) => {
  const calenderService = inject(CalenderService);
  const username = 'joe'; // For now, hardcode the user, but this can be dynamic

  // Convert the observable from the service into a signal
  const userSignal: Signal<User | undefined> = toSignal(calenderService.getUserByUsername(username));

  // Use a computed signal to process the data reactively
  const taskListSignal: Signal<TaskList[] | undefined> = computed(() => {
    const user = userSignal(); // Read the user signal
    return user?.calendar?.taskList;
  });

  // The resolver returns the signal's value
  return taskListSignal();
};