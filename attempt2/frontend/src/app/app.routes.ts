import { Routes } from '@angular/router';
import { Day } from './day/day';
import { Days } from './days/days';
import { Goals } from './goals/goals';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  { path: 'days', component :Days , outlet: 'primary'},
  { path: 'day', component: Day, outlet: 'secondary' },
  { path: 'goals', component: Goals},
  { path: '', redirectTo: 'days', pathMatch: 'full' },
  { path: '**', component: NotFound, title : '404 - Not Found' },
]