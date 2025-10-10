// src/app/generate-calender/generate-calender.service.ts
import { Injectable, inject, signal, WritableSignal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, fromEvent } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DaysCalender, Task } from './days-calender';

@Injectable({ providedIn: 'root' })
export class GenerateCalenderService {
  private http = inject(HttpClient);
  private calendarDataUrl = 'assets/calender-data.json';
  private storageKey = 'calendarState';
  
  // WritableSignal to hold the calendar data
  public calendarState: WritableSignal<DaysCalender | null> = signal(null);
  
  constructor() {
    console.log('GenerateCalenderService initialized');
    console.log(this.storageKey);
    console.log(this.calendarState());
    this.fetchCalendarData();
    this.loadStateFromStorage();
    this.setupBeforeUnloadSave();
    
    // Effect to automatically save state to localStorage whenever it changes
    effect(() => {
      console.log(this.calendarState());
      const state = this.calendarState();
      if (state) {
        this.saveStateToStorage(state);
        console.log('Signal state saved to localStorage.');
      }
    });
  }

  private loadStateFromStorage(): void {
    
    const savedState = localStorage.getItem(this.storageKey);
    if (savedState) {
      const calendar = JSON.parse(savedState);
      // Update the signal directly with the loaded state
      this.calendarState.set(calendar);
    } else {
      this.fetchCalendarData();
    }
  }

  private fetchCalendarData(): void {
    this.http.get<DaysCalender>(this.calendarDataUrl).pipe(
      map(calendar => ({
        ...calendar,
        calendarData: calendar.calendarData.map(day => ({ ...day, date: new Date(day.date) })),
      })),
      catchError(error => {
        console.error('Error loading calendar data:', error);
        return throwError(() => new Error('Error loading calendar data'));
      })
    ).subscribe(data => this.calendarState.set(data));
  }

  private setupBeforeUnloadSave(): void {
    fromEvent(window, 'beforeunload').subscribe(() => {
      const state = this.calendarState();
      if (state) {
        this.saveStateToStorage(state);
      }
    });
  }

  private saveStateToStorage(state: DaysCalender): void {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }
  
  updateTaskStatus(dayDate: Date, taskId: number, newStatus: Task['status']): void {
    this.calendarState.update(currentCalendar => {
      if (!currentCalendar) return null;

      const dayIndex = currentCalendar.calendarData.findIndex(
        day => day.date.toISOString().split('T') === dayDate.toISOString().split('T')
      );
      
      if (dayIndex !== -1) {
        const updatedCalendarData = currentCalendar.calendarData.map((day, index) => {
          if (index === dayIndex) {
            const updatedTasks = day.tasks.map(task =>
              task.id === taskId ? { ...task, status: newStatus } : task
            );
            return { ...day, tasks: updatedTasks };
          }
          return day;
        });
        return { ...currentCalendar, calendarData: updatedCalendarData };
      }
      return currentCalendar;
    });
  }
}
