// src/app/days/days.component.ts
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { DivShow } from '../div-show/div-show';
import { DaysCalender, DayData, DayStatus, TaskStatus } from '../days-calender';
import { DatePipe, CommonModule } from '@angular/common'; // AsyncPipe is no longer needed
import { Router } from '@angular/router';
import { GenerateCalenderService } from '../generate-calender';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-days',
  imports: [DivShow, DatePipe, CommonModule, RouterLink],
  templateUrl: './days.html',
  styleUrl: './days.css',
  standalone: true,
  // Change detection can now be left as default or OnPush,
  // as signals handle granular reactivity
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Days implements OnInit {
  // Directly access the service's signal
  calendar = inject(GenerateCalenderService).calendarState;
  
  
  completeStatus: TaskStatus = 'complete';

  constructor() {
    console.log('Days component initialized');
    console.log('Current calendar state:', this.calendar());
    console.log('Current calendar state:', this.calendar()?.calendarData);

  }

  ngOnInit(): void {
    // No need for a separate subscription, the signal is already active
  }

  getDayStatus(day: DayData): DayStatus {
    console.log("button clicked to change status");
    
    const completeCount = day.tasks.filter(task => task.status === 'complete').length;
    const untouchedCount = day.tasks.filter(task => task.status === 'untouched').length;
    const totalTasks = day.tasks.length;
    
    if (completeCount === totalTasks) return 'complete';
    if (untouchedCount === totalTasks) return 'untouched';
    if (totalTasks - completeCount === 1) return 'lastLeft';
    return 'incomplete';
  }

  formatDate(date: Date): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
  
}
