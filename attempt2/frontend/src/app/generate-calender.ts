import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { DaysCalender } from './days-calender';

@Injectable({
  providedIn: 'root'
})
export class GenerateCalenderService {
  private http = inject(HttpClient);
  private calendarDataUrl = 'assets/calender-data.json';

  constructor() { }

  /**
   * Fetches the calendar data from a JSON file.
   * @returns An Observable of DaysCalender.
   */
  getCalendarData(): Observable<DaysCalender> {
    return this.http.get<DaysCalender>(this.calendarDataUrl).pipe(
    catchError(error => {
      console.error('Error fetching calendar data:', error);
      // Return a "safe" empty object to avoid breaking the async pipe
      return of({ username: '', calendarData: [] });
    })
  );
  }
}