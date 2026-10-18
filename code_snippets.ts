// ---------------------------------------------------------------------------------
// SNIPPET 1: Centralized State Management (from src/app/services/task.service.ts)
// ---------------------------------------------------------------------------------
// The `TaskService` is the heart of the application. It uses Angular Signals (`signal`
// and `computed`) to create a reactive state management system.
// The `tasks` signal holds the state of all tasks, and other parts of the app
// can subscribe to changes to this state.

/*
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

// ... (imports and interface definitions)

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000';

  // Holds the state of all tasks for all days
  private progress = signal<DailyProgress[]>([]);

  // Exposes the progress as a readonly signal
  public readonly progressByDay = computed(() => {
    const progressMap = new Map<string, DailyProgress>();
    for (const p of this.progress()) {
      progressMap.set(p.date, p);
    }
    return progressMap;
  });

  // Fetches initial data from the backend
  constructor() {
    this.http
      .get<DailyProgress[]>(`${this.apiBaseUrl}/progress`)
      .subscribe((data) => this.progress.set(data));
  }

  // Method called by components to update a task's status
  updateTask(date: string, taskId: number, completed: boolean) {
    this.http
      .put<DailyProgress>(`${this.apiBaseUrl}/progress/${date}/task/${taskId}`, {
        completed,
      })
      .subscribe((updatedProgress) => {
        // Updates the signal, which automatically notifies all subscribers
        this.progress.update((currentProgress) =>
          currentProgress.map((p) =>
            p.date === date ? updatedProgress : p
          )
        );
      });
  }
}
*/


// ---------------------------------------------------------------------------------
// SNIPPET 2: Component Interaction with the Service (from src/app/daily-log/daily-log.ts)
// ---------------------------------------------------------------------------------
// The `DailyLog` component gets the date from the route parameters, then uses it to
// get the relevant tasks and progress from the `TaskService`. When a user clicks a
// checkbox, it calls the service's `updateTask` method.

/*
import { Component, inject, input, computed } from '@angular/core';
import { TaskService } from '../services/task.service';

// ... (other imports)

@Component({
  // ...
})
export class DailyLog {
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);

  // Gets the date from the URL (e.g., /log/2024-01-15)
  private readonly date = toSignal(this.route.paramMap.pipe(map(p => p.get('date'))));

  // Gets the progress for the current day from the service
  public readonly dayProgress = computed(() =>
    this.taskService.progressByDay().get(this.date() ?? '')
  );

  // Called from the template when a checkbox is clicked
  onUpdateTask(taskId: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.taskService.updateTask(this.date() ?? '', taskId, input.checked);
  }
}
*/


// ---------------------------------------------------------------------------------
// SNIPPET 3: Application Routing (from src/app/app.routes.ts)
// ---------------------------------------------------------------------------------
// This file defines the navigation structure. It maps URL paths to components.
// Notice the route for `DailyLog` includes a `:date` parameter, allowing the
// component to be reused for any day.

/*
import { Routes } from '@angular/router';
import { ProgressChart } from './progress-chart/progress-chart';
import { DailyLog } from './daily-log/daily-log';

export const routes: Routes = [
  // Default route redirects to the progress chart
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'progress',
  },
  // Route for the main 75-day progress view
  {
    path: 'progress',
    component: ProgressChart,
  },
  // Route for a specific day's log, with a dynamic date parameter
  {
    path: 'log/:date',
    component: DailyLog,
  },
  // Wildcard route to redirect any other URL back to the progress chart
  {
    path: '**',
    redirectTo: 'progress',
  },
];
*/
