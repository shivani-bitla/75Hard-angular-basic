// src/app/days/days.component.ts
import { Component, OnInit, inject, ChangeDetectionStrategy, signal } from '@angular/core';
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
  // Change detection can now be left as default or OnPush,
  // as signals handle granular reactivity
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Days implements OnInit {
  // Directly access the service's signal
  userState = inject(CalenderService).userState;
  currentuser: User|null=null;

  
  
  completeStatus: TaskStatus = 'complete';

  constructor() {
    console.log('Days component initialized');
    console.log('Current calendar state:', this.userState()?.filter(user=>user.username==='joe'));
    this.userState()?.map(user=>{if(user.username==='joe'){ this.currentuser=user}});
    console.log(
      'currentuser',
      this.currentuser
    );
  }

  ngOnInit(): void {
    // No need for a separate subscription, the signal is already active
    
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
