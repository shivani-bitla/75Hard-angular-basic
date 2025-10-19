import { Injectable, inject, signal, WritableSignal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, fromEvent } from 'rxjs';
import { catchError, filter, first, map, tap } from 'rxjs/operators';
import { DaysCalender, Task,  DayData, TaskList } from './calender-interface';
import { User } from  "./user";
import { toObservable } from '@angular/core/rxjs-interop';


@Injectable({ providedIn: 'root' })
export class CalenderService {
  private http = inject(HttpClient);
  // Point to the new JSON file containing an array of users
  private calendarDataUrl = 'assets/calender-data.json';
  private storageKey = 'userState'; // Change key to reflect User data
  
  // WritableSignal to hold the array of users
  public userState: WritableSignal<User[] | null> = signal(null);
  
  constructor() {
    console.log('CalenderService initialized');
    this.loadStateFromStorage();
    this.setupBeforeUnloadSave();
    
    // Effect to automatically save state to localStorage whenever it changes
    effect(() => {
      const state = this.userState();
      if (state) {
        this.saveStateToStorage(state);
        console.log('User state saved to localStorage.');
      }
    });
  }

  private loadStateFromStorage(): void {
    const savedState = localStorage.getItem(this.storageKey);
    if (savedState) {
      try {
        const users: User[] = JSON.parse(savedState);
        console.log("users-",users)
        if (Array.isArray(users)) {
          users.forEach(user => {
            if (user.calendar?.calendarData) {
              user.calendar.calendarData = user.calendar.calendarData.map((day: DayData) => ({
                ...day,
                date: new Date(day.date)
              }));
            }
          });
        }
        this.userState.set(users);
      } catch (e) {
        console.error("Failed to parse user state from localStorage", e);
        this.fetchInitialData();
      }
    } else {
      this.fetchInitialData();
    }
  }

  private fetchInitialData(): void {
    this.http.get<User[]>(this.calendarDataUrl).pipe(
      map(users => users.map(user => {
        if (user.calendar?.calendarData) {
          user.calendar.calendarData = user.calendar.calendarData.map((day: DayData) => ({
            ...day,
            date: new Date(day.date)
          }));
        }
        return user;
      })),
      catchError(error => {
        console.error('Error loading user data:', error);
        return throwError(() => new Error('Error loading user data'));
      })
    ).subscribe(data => {
      if (data) {
        this.userState.set(data);
      }
    });
  }

  // New function to get a specific user as an observable
  getUserByUsername(username: string): Observable<User | undefined> {
    // Return an observable that emits the user when the state is ready
    return toObservable(this.userState).pipe(
      filter(users => users !== null),
      first(),
      map(users => users?.find(u => u.username === username))
    );
  }
  
  private setupBeforeUnloadSave(): void {
    fromEvent(window, 'beforeunload').subscribe(() => {
      const state = this.userState();
      if (state) {
        this.saveStateToStorage(state);
      }
    });
  }

  saveStateToStorage(state: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }
  
  updateTaskStatus(dayDate: Date, taskId: number, newStatus: Task['status']): void {
    this.userState.update(currentUsers => {
      if (!currentUsers) return null;

      return currentUsers.map(currentUser => {
        // Find the specific user to update (if you were doing it this way)
        const username = 'joe'; // or get from auth service
        if (currentUser.username !== username) {
          return currentUser;
        }
        
        const calendar = currentUser.calendar;
        if (!calendar) return currentUser;

        const paramDateUtc = new Date(Date.UTC(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate()));

        const dayIndex = calendar.calendarData.findIndex((day: DayData) => {
          const calendarDateUtc = new Date(Date.UTC(day.date.getFullYear(), day.date.getMonth(), day.date.getDate()));
          return calendarDateUtc.getTime() === paramDateUtc.getTime();
        });
        
        if (dayIndex !== -1) {
          const updatedCalendarData = calendar.calendarData.map((day, index) => {
            if (index === dayIndex) {
              const updatedTasks = day.tasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
              );
              return { ...day, tasks: updatedTasks };
            }
            return day;
          });

          const updatedCalendar: DaysCalender = {
            ...calendar,
            calendarData: updatedCalendarData
          };

          return { ...currentUser, calendar: updatedCalendar };
        }
        return currentUser;
      });
    });
  }

  updateTasks(updatedTaskList: TaskList[]): void {
    const username = 'joe';
    this.userState.update(currentUsers => {
      if (!currentUsers) {
        return currentUsers;
      }
      return currentUsers.map(user => {
        if (user.username === username) {
          return {
            ...user,
            calendar: {
              ...user.calendar,
              taskList: updatedTaskList
            }
          };
        }
        return user;
      });
    });
  }
  
}
