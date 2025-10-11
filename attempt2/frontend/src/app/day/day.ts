// src/app/day/day.component.ts
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DayData, Task } from '../days-calender';
import { CommonModule, DatePipe } from '@angular/common';
import { GenerateCalenderService } from '../generate-calender';
import { DivShow } from '../div-show/div-show';
import { DayWithTaskNames } from '../day-resolver';

@Component({
  selector: 'app-day',
  standalone: true,
  imports: [CommonModule, DatePipe, DivShow, ],
  templateUrl: './day.html',
  styleUrl: './day.css'
})
export class Day implements OnInit {
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private calenderService = inject(GenerateCalenderService);
  
  dayWithTaskNames: DayWithTaskNames  | undefined;

  constructor() {
    console.log('Day component initialized'); // Debug log  
  }
  
  dayData: DayData | undefined;
  displayTasks: (Task & { name: string; order: number })[] = [];

  ngOnInit(): void {
    // Access the resolved data
    this.route.data.subscribe(data => {
      this.dayWithTaskNames = data['dayWithTaskNames'];
      console.log('Resolved day data:', this.dayWithTaskNames);
    });
  }

  onButtonClick(task: Task): void {
    console.log('Button clicked for task:', task);
    task.status = task.status === 'complete' ? 'untouched' : 'complete';
    console.log('Task status changed to:', task.status,"need to save");
    if (this.dayWithTaskNames) {
      this.calenderService.updateTaskStatus(this.dayWithTaskNames.date, task.id, task.status);
    }
    this.cdr.markForCheck();
    console.log('Button changed to:', task.status);
  }
  resetDataClick(): void {
    
  }
}
