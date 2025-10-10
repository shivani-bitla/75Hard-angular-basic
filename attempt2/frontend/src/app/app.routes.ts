import { Routes,RedirectCommand,Router,UrlSerializer } from '@angular/router';
import { Day } from './day/day';
import { Days } from './days/days';
import { Goals } from './goals/goals';
import { NotFound } from './not-found/not-found';
import { dayResolver } from './day-resolver';
import { inject } from '@angular/core';

export const routes: Routes = [
  { path: '', component: Days, title: 'Calendar' },
  { path: 'day/:date', component: Day, title: 'Day Details', resolve: { dayWithTaskNames: dayResolver } },
  { path: 'day',  title: 'Today', redirectTo: () => {
    const today = new Date().toISOString().split('T')[0]; // Use [0] to get the date part
      const router = inject(Router);
      const serializer = inject(UrlSerializer);
      return router.parseUrl(serializer.serialize(router.createUrlTree(['/day', today])));
    },
    pathMatch: 'full'
 },
  { path: 'goals', component: Goals},
  { path: '', redirectTo: 'days', pathMatch: 'full' },
  { path: '**', component: NotFound, title : '404 - Not Found' },
]