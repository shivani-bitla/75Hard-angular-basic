import { Routes } from '@angular/router';
import { DailyLog } from './daily-log/daily-log';
import { ProgressChart } from './progress-chart/progress-chart';

export const routes: Routes = [
  { path: '', redirectTo: '/daily-log', pathMatch: 'full' },
  { path: 'daily-log', component: DailyLog },
  { path: 'daily-log/:date', component: DailyLog},
  { path: 'progress-chart', component: ProgressChart }
];