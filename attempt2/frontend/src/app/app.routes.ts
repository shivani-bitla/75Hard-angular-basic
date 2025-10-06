import { Routes } from '@angular/router';

export const routes: Routes = ['start-date'].map(path => ({ path, loadComponent: () => import('./start-date/start-date').then(c => c.StartDate) }));
