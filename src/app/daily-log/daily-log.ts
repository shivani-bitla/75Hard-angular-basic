import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TaskService, Task, DailyProgress } from '../services/task.service';

@Component({
  selector: 'app-daily-log',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './daily-log.html',
  styleUrls: ['./daily-log.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyLog {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  tasks = this.taskService.tasks;
  date: string;

  constructor() {
    this.date = this.route.snapshot.paramMap.get('date') || new Date().toISOString().split('T')[0];
    this.taskService.getProgressForDate(this.date).subscribe({
      next: (progress) => {
        if (progress) {
          this.taskService.tasks.set(progress.tasks);
        } else {
          this.taskService.tasks.set([...this.taskService.initialTasks]);
        }
      },
      error: (err) => {
        console.error('Failed to load progress:', err);
        this.taskService.tasks.set([...this.taskService.initialTasks]);
      }
    });
  }

  updateTask(taskIndex: number, completed: boolean) {
    this.taskService.updateTask(this.date, taskIndex, completed).subscribe({
      next: () => console.log('Task update successful'),
      error: (err) => console.error('Task update error:', err)
    });
  }
}