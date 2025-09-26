import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskService, Task } from '../services/task.service';

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
  tasks = this.taskService.tasks;
  today = new Date().toISOString().split('T')[0];

  constructor() {
    const dailyProgress = this.taskService.getProgressForDate(this.today);
    if (dailyProgress) {
      this.taskService.tasks.set(dailyProgress.tasks);
    }
  }

  updateTask(taskIndex: number, completed: boolean) {
    this.taskService.updateTask(this.today, taskIndex, completed);
  }
}