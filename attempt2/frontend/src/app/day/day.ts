// src/app/day/day.component.ts
import { ChangeDetectorRef, Component, OnInit, Signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DayData, Task } from '../calender-interface';
import { CommonModule, DatePipe } from '@angular/common';
import { CalenderService } from '../calender';
import { DivShow } from '../div-show/div-show';
import { DayWithTaskNames } from './day-resolver';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-day',
  standalone: true,
  imports: [CommonModule, DatePipe, DivShow, ],
  templateUrl: './day.html',
  styleUrl: './day.css'
})
export class Day implements OnInit {
  
  private route = inject(ActivatedRoute);
  private calenderService = inject(CalenderService); // Inject service, but don't need its state directly here

  // Use toSignal to convert the route data observable into a signal
  dayWithTaskNames: Signal<DayWithTaskNames | undefined> = toSignal(
    this.route.data.pipe(map(data => data['dayWithTaskNames']))
  );
  
  ngOnInit(): void {
  
  }

  onButtonClick(task: Task): void {
    const dayWithTaskNames = this.dayWithTaskNames();
    if (dayWithTaskNames) {
      const newStatus = task.status === 'complete' ? 'untouched' : 'complete';
      this.calenderService.updateTaskStatus(dayWithTaskNames.date, task.id, newStatus);
    }
  }
  
  resetDataClick(): void {
    const username = 'joe'; // Assuming 'joe' is the current user
    
  }
}
