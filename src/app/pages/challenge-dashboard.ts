import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, User } from '@angular/fire/auth';
import { TaskService, UserData, TaskConfig } from '../services/task.service';
import { TaskEditComponent } from './task-edit';
import { OnboardingComponent } from './onboarding';

@Component({
  selector: 'app-challenge-dashboard',
  standalone: true,
  imports: [CommonModule, TaskEditComponent, OnboardingComponent],
  template: `
    <!-- Onboarding Modal if not yet onboarded -->
    @if (userData() && userData()?.onboarded === false) {
      <app-onboarding 
        [initialStartDate]="userData()?.startDate || todayStr"
        [initialTasks]="userData()?.tasksConfig || []"
        (onboardingCompleted)="handleOnboardingComplete($event)"
      />
    }

    <div class="dashboard-container">
      @if (userData()) {
        <!-- Controls: Start Date & Progress Summary -->
        <section class="card controls-section">
          <div class="control-group">
            <label for="startDateInput">Challenge Start Date: </label>
            <input 
              id="startDateInput"
              type="date" 
              [value]="userData()?.startDate" 
              (change)="onStartDateChange($event)"
            />
          </div>
          <div class="stats">
            <span class="badge">Completed Days: <strong>{{ completedDaysCount() }}/75</strong></span>
          </div>
        </section>

        <!-- Daily Task Logger & Customization Editor -->
        <div class="grid-layout-2col">
          <section class="card daily-section">
            <h2>Today's Tasks <small class="date-badge">{{ todayStr }}</small></h2>
            <div class="task-list">
              @for (task of userData()?.tasksConfig || []; track task.id) {
                <label class="task-item">
                  <input 
                    type="checkbox" 
                    [checked]="isTaskCompletedToday(task.id)"
                    (change)="toggleTaskToday(task.id, $event)"
                  />
                  <span>{{ task.name }}</span>
                </label>
              }
            </div>
            <button class="toggle-edit-btn" (click)="toggleEditor()">
              {{ showTaskEditor() ? 'Close Task Editor' : '⚙️ Customize Tasks' }}
            </button>
          </section>

          @if (showTaskEditor()) {
            <section class="card editor-wrapper">
              <app-task-edit 
                [tasks]="userData()?.tasksConfig || []" 
                (tasksUpdated)="handleTasksUpdated($event)"
              />
            </section>
          }
        </div>

        <!-- 75-Day Progress Grid View -->
        <section class="card grid-section">
          <h2>75-Day Journey Grid</h2>
          <div class="legend">
            <span class="legend-item"><span class="dot green"></span> All Done (Green)</span>
            <span class="legend-item"><span class="dot yellow"></span> Partial >2 Done (Yellow)</span>
            <span class="legend-item"><span class="dot red"></span> Missed/Incomplete (Red)</span>
            <span class="legend-item"><span class="dot today"></span> Today</span>
          </div>
          
          <div class="days-grid">
            @for (day of seventyFiveDays(); track day.dateStr) {
              <div class="day-box" [ngClass]="day.statusClass">
                <span class="day-num">Day {{ day.dayNum }}</span>
                <small class="day-date">{{ day.dateStr }}</small>
                <div class="day-count">{{ day.completedCount }}/{{ day.totalTasks }}</div>
              </div>
            }
          </div>
        </section>
      } @else {
        <div class="loading-state">Loading your challenge data...</div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #f8fafc;
      min-height: 100vh;
      font-family: 'Inter', system-ui, sans-serif;
      color: #1e293b;
    }
    .dashboard-container { max-width: 1000px; margin: 0 auto; }
    .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; }
    .controls-section { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
    .controls-section input[type="date"] { padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; }
    .badge { background: #e0f2fe; color: #0369a1; padding: 6px 12px; border-radius: 20px; font-weight: 500; }
    .date-badge { font-size: 0.85rem; color: #64748b; font-weight: normal; margin-left: 10px; }
    .grid-layout-2col { display: flex; flex-direction: column; gap: 20px; }
    .task-list { display: flex; flex-direction: column; gap: 12px; margin: 15px 0; }
    .task-item { display: flex; gap: 12px; align-items: center; font-size: 1rem; cursor: pointer; }
    .task-item input[type="checkbox"] { width: 18px; height: 18px; accent-color: #0284c7; cursor: pointer; }
    .toggle-edit-btn { background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 500; }
    .toggle-edit-btn:hover { background: #e2e8f0; }
    .loading-state { text-align: center; padding: 50px; color: #64748b; font-weight: 500; }
    
    /* Legend & Grid Styles */
    .legend { display: flex; gap: 15px; font-size: 0.85rem; margin-bottom: 15px; flex-wrap: wrap; align-items: center; color: #64748b; }
    .legend-item { display: flex; align-items: center; gap: 5px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    .dot.green { background: #22c55e; }
    .dot.yellow { background: #eab308; }
    .dot.red { background: #ef4444; }
    .dot.today { background: #0ea5e9; }

    .days-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(95px, 1fr)); gap: 10px; }
    .day-box { padding: 12px 8px; border: 1px solid #e2e8f0; text-align: center; border-radius: 8px; background: #f8fafc; font-size: 0.85rem; }
    .day-num { display: block; font-weight: bold; color: #334155; }
    .day-date { color: #64748b; font-size: 0.75rem; }
    .day-count { margin-top: 4px; font-size: 0.75rem; font-weight: 600; }
    
    .day-box.success-green { background: #dcfce7; border-color: #86efac; color: #166534; }
    .day-box.success-green .day-num, .day-box.success-green .day-date, .day-box.success-green .day-count { color: #166534; }
    
    .day-box.warning-yellow { background: #fef9c3; border-color: #fde047; color: #854d0e; }
    .day-box.warning-yellow .day-num, .day-box.warning-yellow .day-date, .day-box.warning-yellow .day-count { color: #854d0e; }
    
    .day-box.missed-red { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
    .day-box.missed-red .day-num, .day-box.missed-red .day-date, .day-box.missed-red .day-count { color: #991b1b; }
    
    .day-box.today { border: 2px solid #0284c7; background: #f0f9ff; font-weight: bold; }
  `]
})
export class ChallengeDashboardComponent implements OnInit {
  private auth = inject(Auth);
  private taskService = inject(TaskService);

  userData = signal<UserData | null>(null);
  showTaskEditor = signal<boolean>(false);
  todayStr = new Date().toLocaleDateString('en-CA');

  async ngOnInit() {
    // Fallback if auth is already initialized or takes a moment
    const user = this.auth.currentUser;
    if (user) {
      const data = await this.taskService.getUserData(user.uid);
      this.userData.set(data);
    } else {
      this.taskService.user$.subscribe(async (firebaseUser) => {
        if (firebaseUser) {
          const data = await this.taskService.getUserData(firebaseUser.uid);
          this.userData.set(data);
        }
      });
    }
  }

  async handleOnboardingComplete(event: { startDate: string; tasksConfig: TaskConfig[] }) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;

    await this.taskService.completeOnboarding(currentUser.uid, event.startDate, event.tasksConfig);
    
    this.userData.update(current => current ? {
      ...current,
      startDate: event.startDate,
      tasksConfig: event.tasksConfig,
      onboarded: true
    } : null);
  }

  isTaskCompletedToday(taskId: string): boolean {
    const data = this.userData();
    if (!data || !data.logs || !data.logs[this.todayStr]) return false;
    return !!data.logs[this.todayStr][taskId];
  }

  async toggleTaskToday(taskId: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const currentUser = this.auth.currentUser;
    const data = this.userData();
    if (!currentUser || !data) return;

    const updatedLogs = await this.taskService.updateTaskLog(
      currentUser.uid, 
      this.todayStr, 
      taskId, 
      checked, 
      data.logs || {}
    );

    this.userData.update(current => current ? { ...current, logs: updatedLogs } : null);
  }

  toggleEditor() {
    this.showTaskEditor.update(v => !v);
  }

  async handleTasksUpdated(newTasks: TaskConfig[]) {
    const currentUser = this.auth.currentUser;
    const data = this.userData();
    if (!currentUser || !data) return;

    await this.taskService.updateTaskConfig(currentUser.uid, newTasks);
    this.userData.update(current => current ? { ...current, tasksConfig: newTasks } : null);
    this.showTaskEditor.set(false);
  }

  async onStartDateChange(event: Event) {
    const newDate = (event.target as HTMLInputElement).value;
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;

    await this.taskService.updateStartDate(currentUser.uid, newDate);
    this.userData.update(current => current ? { ...current, startDate: newDate } : null);
  }

  seventyFiveDays = computed(() => {
    const data = this.userData();
    if (!data || !data.startDate) return [];

    const days = [];
    const startDateObj = new Date(data.startDate);
    const totalTasks = data.tasksConfig?.length || 6;
    const logs = data.logs || {};

    for (let i = 0; i < 75; i++) {
      const current = new Date(startDateObj);
      current.setDate(startDateObj.getDate() + i);
      const dateStr = current.toLocaleDateString('en-CA');

      const dayLogs = logs[dateStr] || {};
      const completedCount = Object.values(dayLogs).filter(Boolean).length;
      
      let statusClass = 'future';
      if (dateStr === this.todayStr) {
        statusClass = 'today';
      } else if (dateStr < this.todayStr) {
        if (completedCount === totalTasks) {
          statusClass = 'success-green';
        } else if (completedCount > 2) {
          statusClass = 'warning-yellow';
        } else {
          statusClass = 'missed-red';
        }
      }

      days.push({
        dayNum: i + 1,
        dateStr,
        completedCount,
        totalTasks,
        statusClass
      });
    }
    return days;
  });

  completedDaysCount = computed(() => {
    return this.seventyFiveDays().filter(d => d.statusClass === 'success-green').length;
  });
}