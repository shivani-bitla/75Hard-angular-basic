import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface Task {
  name: string;
  completed: boolean;
}

export interface DailyProgress {
  date: string;
  tasks: Task[];
  allCompleted: boolean;
}

export interface StartDate {
  date: string;
}

export interface UpdateResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8000';
  public readonly initialTasks: Task[] = [
    { name: '45 mins outdoor workout', completed: false },
    { name: '45 mins indoor workout', completed: false },
    { name: 'Follow a meal plan', completed: false },
    { name: 'Drink 1 gallon of water', completed: false },
    { name: 'Upload to Instagram', completed: false },
    { name: 'Build frontend app & upload to GitHub', completed: false }
  ];

  private progress = signal<DailyProgress[]>([]);
  private startDate = signal<string>(new Date().toISOString().split('T')[0]);
  tasks = signal<Task[]>(this.initialTasks);
  progressComputed = computed(() => this.progress());
  startDateComputed = computed(() => this.startDate());

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.http.get<DailyProgress[]>(`${this.apiUrl}/progress`).pipe(
      tap(() => console.log('Fetching progress from', `${this.apiUrl}/progress`)),
      catchError(err => {
        console.error('Progress fetch failed:', err.message, err.status, err.url);
        return of([]);
      })
    ).subscribe(progress => {
      console.log('Progress loaded:', progress);
      this.progress.set(progress);
    });

    this.http.get<StartDate>(`${this.apiUrl}/start-date`).pipe(
      tap(() => console.log('Fetching start date from', `${this.apiUrl}/start-date`)),
      catchError(err => {
        console.error('Start date fetch failed:', err.message, err.status, err.url);
        return of({ date: new Date().toISOString().split('T')[0] });
      })
    ).subscribe(startDate => {
      console.log('Start date loaded:', startDate.date);
      this.startDate.set(startDate.date);
    });
  }

  updateTask(date: string, taskIndex: number, completed: boolean): Observable<UpdateResponse> {
    const task: Task = { ...this.initialTasks[taskIndex], completed };
    return this.http.put<UpdateResponse>(`${this.apiUrl}/progress/${date}`, task, { params: { task_index: taskIndex } })
      .pipe(
        tap(() => console.log('Updating task for', date, 'index', taskIndex)),
        tap(() => {
          this.tasks.update(tasks => {
            const updatedTasks = [...tasks];
            updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], completed };
            return updatedTasks;
          });
          this.loadInitialData(); // Refresh progress for ProgressChartComponent
        }),
        catchError(err => {
          console.error('Task update failed:', err.message, err.status, err.url);
          return of({ message: 'Update failed' });
        }),
        tap(() => console.log('Task update completed for', date))
      );
  }

  getProgressForDate(date: string): Observable<DailyProgress | undefined> {
    return this.http.get<DailyProgress>(`${this.apiUrl}/progress/${date}`)
      .pipe(
        tap(progress => console.log('Progress for', date, ':', progress)),
        tap(progress => {
          if (progress) {
            this.progress.update(p => {
              const existing = p.find(dp => dp.date === date);
              if (!existing) p.push(progress);
              return [...p];
            });
            this.tasks.set(progress.tasks); // Ensure tasks signal is updated
          } else {
            this.tasks.set([...this.initialTasks]);
          }
        }),
        catchError(err => {
          console.error('Progress fetch for', date, 'failed:', err.message, err.status, err.url);
          return of(undefined);
        })
      );
  }

  resetProgress() {
    this.http.delete(`${this.apiUrl}/progress`)
      .pipe(
        tap(() => console.log('Resetting progress')),
        tap(() => {
          this.progress.set([]);
          this.startDate.set(new Date().toISOString().split('T')[0]);
          this.tasks.set([...this.initialTasks]);
        }),
        catchError(err => {
          console.error('Reset failed:', err.message, err.status, err.url);
          return of(null);
        })
      )
      .subscribe();
  }

  setStartDate(date: string) {
    this.http.put(`${this.apiUrl}/start-date`, { date })
      .pipe(
        tap(() => console.log('Setting start date to', date)),
        tap(() => this.startDate.set(date)),
        catchError(err => {
          console.error('Start date update failed:', err.message, err.status, err.url);
          return of(null);
        })
      )
      .subscribe();
  }
}