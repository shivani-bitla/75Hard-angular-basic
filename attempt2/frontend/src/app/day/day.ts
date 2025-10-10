// src/app/day/day.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DayData, Task } from '../days-calender';
import { CommonModule, DatePipe } from '@angular/common';
import { GenerateCalenderService } from '../generate-calender';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-day',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './day.html',
  styleUrl: './day.css'
})
export class Day implements OnInit {
  private route = inject(ActivatedRoute);
  private calenderService = inject(GenerateCalenderService);

  constructor() {
    console.log('Day component initialized'); // Debug log  
  }
  
  dayData: DayData | undefined;
  private subscription: Subscription | undefined;

  // Define constant tasks here
  constantTasks: Task[] = [
    { id: 1, task: 'Complete Project Proposal', status: 'untouched' },
    { id: 2, task: 'Attend Team Meeting', status: 'untouched' },
    { id: 3, task: 'Review Code Changes', status: 'untouched' },
    { id: 4, task: 'Prepare Client Presentation', status: 'untouched' },
    { id: 5, task: 'Respond to Emails', status: 'untouched' },
    { id: 6, task: 'Update Documentation', status: 'untouched' }
  ];

  ngOnInit(): void {
    // Get the resolved data directly from the route
    this.route.data.subscribe(data => {
      this.dayData = data['dayData'];
      console.log('Resolved day data:', this.dayData);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onButtonClick(task: Task): void {
    console.log('Button clicked for task:', task); // Debug log
    if (this.dayData) {
      const taskToUpdate = this.dayData.tasks.find(t => t.id === task.id);
      if (taskToUpdate) {
        taskToUpdate.status = taskToUpdate.status === 'complete' ? 'untouched' : 'complete';
      }
    }
  }
  newDataClick(): void {
    
  }
}
