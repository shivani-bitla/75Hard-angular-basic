import { Routes } from '@angular/router';
import { Day } from './day/day';
import { Days } from './days/days';
import { Goals } from './goals/goals';
import { NotFound } from './not-found/not-found';
import { dayResolver } from './day-resolver';

export const routes: Routes = [
  { path: '', component: Days, title: 'Calendar' },
  { path: 'day/:date', component: Day, title: 'Day Details', resolve: { dayData: dayResolver } },
  { path: 'day', component: Day, title: 'Today', resolve: { dayData: dayResolver } },
  { path: 'goals', component: Goals},
  { path: '', redirectTo: 'days', pathMatch: 'full' },
  { path: '**', component: NotFound, title : '404 - Not Found' },
]