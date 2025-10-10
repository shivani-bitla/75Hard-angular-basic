// src/app/days/days.component.ts
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { DivShow } from '../div-show/div-show';
import { DaysCalender, DayData, DayStatus } from '../days-calender';
import { DatePipe, AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GenerateCalenderService } from '../generate-calender';

@Component({
  selector: 'app-days',
  imports: [DivShow, DatePipe, AsyncPipe, CommonModule],
  templateUrl: './days.html',
  styleUrl: './days.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Days implements OnInit {
  calendar$!: Observable<DaysCalender | null>;
  firstDate$!: Observable<Date | null>; // Declare a new observable for the first date
  completeStatus = 'complete';
  firstDate: Date | null = null;
  

  constructor() {
    console.log('Days component initialized'); // Debug log  
  }
  
  private calenderService = inject(GenerateCalenderService);
  private router = inject(Router);
  
  ngOnInit(): void {
    // Subscribe to the shared service's observable
    this.calenderService.getCalendarData().subscribe();
    this.calendar$ = this.calenderService.calendarData$;

    
    this.firstDate$ = this.calendar$.pipe(
      filter(calendar => calendar !== null && calendar.calendarData.length > 0),
      map(calendar => calendar!.calendarData[0].date)
    );console.log('First date observable set up'); // Debug log
    console.log(this.firstDate$); // Debug log  
    this.firstDate$.pipe(first()).subscribe(date => {
      this.firstDate = date;
      console.log('First date:', this.firstDate); // Debug log
    });
  }

  getDayStatus(day: DayData, status: string): DayStatus {
    const count = day.tasks.filter(task => task.status === status).length;
    switch (count) {
      case 0:
        return 'untouched';
      case 5:
        return 'lastLeft';
      case 6:
        return 'complete';
      default:
        return 'incomplete';
    }
  }

  onDayClick(day: DayData): void {
    console.log('Day clicked:', day);
    const dateObject = new Date(day.date);
    const dateParam = dateObject.toISOString().split('T');
    this.router.navigate(['/day', dateParam]);
  }
}
