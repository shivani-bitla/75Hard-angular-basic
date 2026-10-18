import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/landing').then(m => m.LandingComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/challenge-dashboard').then(m => m.ChallengeDashboardComponent),
    canActivate: [authGuard]   
  },
  { 
    path: 'friends', 
    loadComponent: () => import('./pages/friends').then(m => m.FriendsComponent),
    canActivate: [authGuard]
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];