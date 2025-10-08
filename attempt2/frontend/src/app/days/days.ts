import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { DivShow } from '../div-show/div-show';
import { DaysCalender, DayData, DayStatus } from '../days-calender';
import { DatePipe, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { GenerateCalenderService } from '../generate-calender';

@Component({
  selector: 'app-days',
  imports: [DivShow, DatePipe, AsyncPipe], // Add AsyncPipe to imports
  templateUrl: './days.html',
  styleUrl: './days.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush // Implement OnPush strategy
})
export class Days implements OnInit {
  calendar$!: Observable<DaysCalender>; // Use Observable convention
  completeStatus = 'complete';

  private calenderService = inject(GenerateCalenderService);

  constructor() {}

  ngOnInit(): void {
    // Fetch data and assign the observable to the class property
    this.calendar$ = this.calenderService.getCalendarData();
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
    
  }
}
