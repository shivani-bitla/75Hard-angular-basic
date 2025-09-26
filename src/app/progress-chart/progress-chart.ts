import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService, DailyProgress } from '../services/task.service';

@Component({
  selector: 'app-progress-chart',
  imports: [],
  templateUrl: './progress-chart.html',
  styleUrl: './progress-chart.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressChartComponent {
  private taskService = inject(TaskService);
  days = Array.from({ length: 75 }, (_, i) => i + 1);
  progress = this.taskService.progressComputed;

  isDayCompleted(day: number): boolean {
    const date = new Date();
    date.setDate(date.getDate() - (75 - day));
    const dateStr = date.toISOString().split('T')[0];
    return this.progress().find(p => p.date === dateStr)?.allCompleted || false;
  }
}