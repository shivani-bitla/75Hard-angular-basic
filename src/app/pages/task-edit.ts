import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskConfig } from '../services/task.service';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="task-editor">
      <h3>Customize Challenge Tasks</h3>
      <div class="task-row" *ngFor="let task of tasks; let i = index">
        <input [(ngModel)]="task.name" placeholder="Task name..." />
        <button class="delete-btn" (click)="removeTask(i)">Remove</button>
      </div>
      <div class="add-row">
        <input [(ngModel)]="newTaskName" placeholder="New habit name..." />
        <button class="add-btn" (click)="addTask()">Add Habit</button>
      </div>
      <button class="save-btn" (click)="saveChanges()">Save Tasks Configuration</button>
    </div>
  `,
  styles: [`
    .task-editor { background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
    .task-row, .add-row { display: flex; gap: 10px; margin-bottom: 10px; }
    input { flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; }
    button { padding: 8px 14px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; }
    .delete-btn { background: #fee2e2; color: #dc2626; }
    .add-btn { background: #e0f2fe; color: #0284c7; }
    .save-btn { width: 100%; background: #0f172a; color: white; margin-top: 15px; padding: 10px; }
  `]
})
export class TaskEditComponent {
  @Input() tasks: TaskConfig[] = [];
  @Output() tasksUpdated = new EventEmitter<TaskConfig[]>();

  newTaskName = '';

  addTask() {
    if (!this.newTaskName.trim()) return;
    const newId = `task-${Date.now()}`;
    this.tasks.push({ id: newId, name: this.newTaskName.trim() });
    this.newTaskName = '';
  }

  removeTask(index: number) {
    this.tasks.splice(index, 1);
  }

  saveChanges() {
    this.tasksUpdated.emit(this.tasks);
  }
}
