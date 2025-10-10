import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError,filter } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DaysCalender } from './days-calender';

@Injectable({
  providedIn: 'root'
})
export class GenerateCalenderService {
  private http = inject(HttpClient);
  private calendarDataUrl = 'assets/calender-data.json';
  
  // Use a BehaviorSubject to store and emit the data
  private calendarDataSubject = new BehaviorSubject<DaysCalender | null>(null);
  calendarData$ = this.calendarDataSubject.asObservable();

  constructor() {}

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
}
