import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth, user, signOut } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Fixed Header Shell -->
    <header class="fixed-header">
      <div class="header-content">
        <div class="title-area">
          <h1>75 Hard Tracker</h1>
        </div>
        
        <!-- Navigation Menu Bar Under Title -->
        <nav class="nav-bar">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
          <span class="separator">•</span>
          <a routerLink="/friends" routerLinkActive="active">Friends Accountability</a>
        </nav>
      </div>

      @if (currentUser()) {
        <div class="user-actions">
          <span class="user-name">{{ currentUser()?.displayName }}</span>
          <button class="logout-btn" (click)="logout()">Sign Out</button>
        </div>
      }
    </header>

    <!-- Routed Page Content Container -->
    <main class="main-content">
      <router-outlet />
    </main>
  `,
  styles: [`
    :host {
      display: block;
      background: #f8fafc;
      min-height: 100vh;
      font-family: 'Inter', system-ui, sans-serif;
      color: #1e293b;
    }

    /* Fixed Header Styling */
    .fixed-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 75px;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      box-sizing: border-box;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .header-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .fixed-header h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
    }

    /* Navigation Bar Under Title */
    .nav-bar {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 2px;
    }

    .nav-bar a {
      text-decoration: none;
      color: #64748b;
      font-size: 0.825rem;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-bar a:hover {
      color: #0284c7;
    }

    .nav-bar a.active {
      color: #0284c7;
      font-weight: 700;
    }

    .separator {
      color: #cbd5e1;
      font-size: 0.75rem;
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-name {
      font-size: 0.9rem;
      font-weight: 500;
      color: #334155;
    }

    .logout-btn {
      background: #fee2e2;
      color: #dc2626;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
    }

    .logout-btn:hover {
      background: #fecaca;
    }

    /* Main Content Offset */
    .main-content {
      padding-top: 95px;
      padding-bottom: 30px;
      max-width: 1000px;
      margin: 0 auto;
      padding-left: 20px;
      padding-right: 20px;
    }
  `]
})
export class App {
  private auth = inject(Auth);
  
  // Converts the Firebase auth observable into an Angular signal
  currentUser = toSignal(user(this.auth), { initialValue: null });

  async logout() {
    await signOut(this.auth);
  }
}