// src/app/days/days.component.ts
import { Component, OnInit, inject, ChangeDetectionStrategy, signal, Input, computed } from '@angular/core';
import { DivShow } from '../div-show/div-show';
import { DaysCalender, DayData, DayStatus, TaskStatus } from '../calender-interface';
import { DatePipe, CommonModule } from '@angular/common'; // AsyncPipe is no longer needed
import { CalenderService } from '../calender';
import { RouterOutlet } from "@angular/router";
import { User } from '../user';

@Component({
  selector: 'app-days',
  imports: [DivShow, DatePipe, CommonModule, RouterOutlet],
  templateUrl: './days.html',
  styleUrl: './days.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Days implements OnInit {
  completeStatus: TaskStatus = 'complete';
  private calenderService = inject(CalenderService);

  private userSignal = this.calenderService.userState;
  currentUser = computed(() => {
    const user = this.userSignal();
    return user;
  });

  constructor() {
    console.log('Days component initialized');
    console.log(
      'currentuser', this.currentUser()
    );
  }
  ngOnInit(): void {
  }
  getDayStatus(day: DayData): DayStatus {    
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
