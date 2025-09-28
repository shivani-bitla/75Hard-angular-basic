import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskService, DailyProgress } from '../services/task.service';

@Component({
  selector: 'app-progress-chart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './progress-chart.html',
  styleUrl: './progress-chart.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressChart {
  private taskService = inject(TaskService);
  days = Array.from({ length: 75 }, (_, i) => i + 1);
  progress = this.taskService.progressComputed;
  startDate = this.taskService.startDateComputed();

  isDayCompleted(day: number): boolean {
    const date = new Date(this.startDate);
    date.setDate(date.getDate() + (day - 1));
    const dateStr = date.toISOString().split('T')[0];
    return this.progress().find(p => p.date === dateStr)?.allCompleted || false;
  }

  getDateForDay(day: number): string {
    const date = new Date(this.startDate);
    date.setDate(date.getDate() + (day - 1));
    return date.toISOString().split('T')[0];
  }

  updateStartDate(newDate: string) {
    if (newDate) { // Ensure valid date
      this.taskService.setStartDate(newDate);
    }
  }

  resetProgress() {
    this.taskService.resetProgress();
  }
}