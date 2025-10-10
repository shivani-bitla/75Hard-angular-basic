import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError,filter } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { DaysCalender,Task } from './days-calender';

@Injectable({
  providedIn: 'root'
})
export class GenerateCalenderService {
  private http = inject(HttpClient);
  private calendarDataUrl = 'assets/calender-data.json';
  
  // Use a BehaviorSubject to store and emit the data
  private calendarDataSubject = new BehaviorSubject<DaysCalender | null>(null);
  public calendarData$: Observable<DaysCalender> = this.calendarDataSubject.asObservable().pipe(
      filter((data): data is DaysCalender => data !== null),
      map(calendar => ({
        ...calendar,
        calendarData: calendar.calendarData.map(day => ({
          ...day,
          date: new Date(day.date),
        })),
      }))
    );

  constructor() {
    this.fetchCalendarData(); // Fetch data when the service is created
  }

  // Method to fetch data from the server and update the subject
  private fetchCalendarData(): void {
    this.http.get<DaysCalender>(this.calendarDataUrl).pipe(
      map(calendar => ({
        ...calendar,
        calendarData: calendar.calendarData.map(day => ({
          ...day,
          date: new Date(day.date),
        })),
      })),
      tap(data => this.calendarDataSubject.next(data)),
      catchError(error => {
        this.calendarDataSubject.error(error);
        return throwError(() => new Error('Error loading calendar data'));
      })
    ).subscribe();
  }

  // Fetch the data and store it in the BehaviorSubject
  getCalendarData(): Observable<DaysCalender> {
    if (this.calendarDataSubject.value) {
      return this.calendarDataSubject.asObservable().pipe(filter((data): data is DaysCalender => data !== null) // Filter out null values
    );
    } else {
      return this.http.get<DaysCalender>(this.calendarDataUrl).pipe(
        tap(data => this.calendarDataSubject.next(data)),
        catchError(error => {
          this.calendarDataSubject.error(error);
          return throwError(() => new Error('Error loading calendar data'));
        })
      );
    }
  }

  updateTaskStatus(dayDate: Date, taskId: number, newStatus: Task['status']): void {
    const currentCalendar = this.calendarDataSubject.value;
    if (currentCalendar) {
      const dayToUpdate = currentCalendar.calendarData.find(
        day => day.date.toISOString().split('T') === dayDate.toISOString().split('T')
      );
      if (dayToUpdate) {
        const taskToUpdate = dayToUpdate.tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
          taskToUpdate.status = newStatus;
          this.calendarDataSubject.next(currentCalendar); // Emit the updated data
        }
      }
    }
  }

}
