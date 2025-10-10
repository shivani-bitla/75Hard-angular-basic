// src/app/day/day.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DayData, Task } from '../days-calender';
import { CommonModule, DatePipe } from '@angular/common';
import { GenerateCalenderService } from '../generate-calender';
import { Subscription } from 'rxjs';
import { DivShow } from '../div-show/div-show';

@Component({
  selector: 'app-day',
  standalone: true,
  imports: [CommonModule, DatePipe,DivShow],
  templateUrl: './day.html',
  styleUrl: './day.css'
})
export class Day implements OnInit {
  private route = inject(ActivatedRoute);
  private calenderService = inject(GenerateCalenderService);
  dayWithTaskNames: { date: Date; tasks: (Task & { name?: string })[] } | undefined;
  

  constructor() {
    console.log('Day component initialized'); // Debug log  
  }
  
  dayData: DayData | undefined;
  displayTasks: (Task & { name: string; order: number })[] = [];
  private subscription: Subscription | undefined;

  // Define constant tasks here
  

  ngOnInit(): void {
    // Access the resolved data
    this.route.data.subscribe(data => {
      this.dayWithTaskNames = data['dayWithTaskNames'];
      console.log('Resolved day data:', this.dayWithTaskNames);
    });
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
