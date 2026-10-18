import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskConfig } from '../services/task.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-card">
        <h2>Welcome to 75 Hard Social!</h2>
        <p class="subtitle">Set up your challenge parameters before beginning your 75-day transformation.</p>

        <!-- Start Date Selection -->
        <div class="form-group">
          <label><strong>Challenge Start Date</strong></label>
          <input type="date" [(ngModel)]="startDate" class="date-input" />
          <small class="hint">You can start today or backdate if you've already begun.</small>
        </div>

        <!-- Task Customization Preview -->
        <div class="form-group">
          <label><strong>Your 6 Daily Core Tasks</strong></label>
          <small class="hint">Customize them to fit your personal regimen:</small>
          
          <div class="task-inputs">
            @for (task of tasks; track task.id; let i = $index) {
              <div class="task-edit-row">
                <span class="task-num">#{{ i + 1 }}</span>
                <input type="text" [(ngModel)]="task.name" placeholder="Task description..." />
                <button class="remove-btn" (click)="removeTask(i)" [disabled]="tasks.length <= 1">✕</button>
              </div>
            }
          </div>
          
          <button class="add-task-btn" (click)="addTask()">+ Add Custom Habit</button>
        </div>

        <button class="launch-btn" (click)="finishOnboarding()">Start My 75 Hard Journey 🔥</button>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 20px; backdrop-filter: blur(4px); }
    .modal-card { background: white; width: 100%; max-width: 550px; padding: 30px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); max-height: 90vh; overflow-y: auto; }
    h2 { margin-top: 0; color: #0f172a; font-size: 1.75rem; }
    .subtitle { color: #64748b; margin-bottom: 24px; font-size: 0.95rem; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 6px; color: #334155; }
    .hint { display: block; color: #64748b; font-size: 0.8rem; margin-top: 4px; }
    .date-input { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; }
    .task-inputs { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
    .task-edit-row { display: flex; align-items: center; gap: 8px; }
    .task-num { font-size: 0.85rem; font-weight: bold; color: #64748b; width: 25px; }
    .task-edit-row input { flex: 1; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem; }
    .remove-btn { background: #fee2e2; color: #dc2626; border: none; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-weight: bold; }
    .remove-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .add-task-btn { background: #f1f5f9; border: 1px dashed #cbd5e1; color: #0284c7; width: 100%; padding: 8px; border-radius: 6px; margin-top: 8px; cursor: pointer; font-weight: 500; }
    .add-task-btn:hover { background: #e2e8f0; }
    .launch-btn { width: 100%; background: #0284c7; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 10px; transition: background 0.2s; }
    .launch-btn:hover { background: #0369a1; }
  `]
})
export class OnboardingComponent {
  @Input() initialStartDate: string = new Date().toLocaleDateString('en-CA');
  @Input() initialTasks: TaskConfig[] = [];
  @Output() onboardingCompleted = new EventEmitter<{ startDate: string; tasksConfig: TaskConfig[] }>();

  startDate = this.initialStartDate;
  tasks: TaskConfig[] = JSON.parse(JSON.stringify(this.initialTasks)); // Deep copy

  addTask() {
    this.tasks.push({ id: `task-${Date.now()}`, name: '' });
  }

  removeTask(index: number) {
    if (this.tasks.length > 1) {
      this.tasks.splice(index, 1);
    }
  }

  finishOnboarding() {
    // Filter out any empty task names
    const cleanedTasks = this.tasks.filter(t => t.name.trim() !== '');
    if (cleanedTasks.length === 0) {
      alert('Please keep at least one active task for your challenge.');
      return;
    }
    this.onboardingCompleted.emit({
      startDate: this.startDate,
      tasksConfig: cleanedTasks
    });
  }
}