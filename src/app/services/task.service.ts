import { Injectable, signal, computed } from '@angular/core';

export interface Task {
  name: string;
  completed: boolean;
}

export interface DailyProgress {
  date: string;
  tasks: Task[];
  allCompleted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private initialTasks: Task[] = [
    { name: '45 mins outdoor workout', completed: false },
    { name: '45 mins indoor workout', completed: false },
    { name: 'Follow a meal plan', completed: false },
    { name: 'Drink 1 gallon of water', completed: false },
    { name: 'Upload to Instagram', completed: false },
    { name: 'Build frontend app & upload to GitHub', completed: false }
  ];

  // Use signals for reactive state
  private progress = signal<DailyProgress[]>(this.loadProgress());
  tasks = signal<Task[]>(this.initialTasks);
  progressComputed = computed(() => this.progress());

  updateTask(date: string, taskIndex: number, completed: boolean) {
    this.progress.update(progress => {
      let dailyProgress = progress.find(p => p.date === date);
      if (!dailyProgress) {
        dailyProgress = { date, tasks: JSON.parse(JSON.stringify(this.initialTasks)), allCompleted: false };
        progress.push(dailyProgress);
      }
      dailyProgress.tasks[taskIndex].completed = completed;
      dailyProgress.allCompleted = dailyProgress.tasks.every(task => task.completed);
      return [...progress];
    });
    this.saveProgress();
  }

  getProgressForDate(date: string): DailyProgress | undefined {
    return this.progress().find(p => p.date === date);
  }

  private saveProgress() {
    localStorage.setItem('progress', JSON.stringify(this.progress()));
  }

  private loadProgress(): DailyProgress[] {
    const saved = localStorage.getItem('progress');
    return saved ? JSON.parse(saved) : [];
  }
}