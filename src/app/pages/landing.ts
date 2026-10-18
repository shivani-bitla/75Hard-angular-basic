import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-container">
      <div class="hero-card">
        <h1>75 Hard Accountability Hub</h1>
        <p>Transform your habits, build unbreakable mental toughness, and track your journey with friends.</p>
        <button class="google-btn" (click)="login()">Sign in with Google to Start</button>
      </div>
    </div>
  `,
  styles: [`
    .landing-container { display: flex; justify-content: center; align-items: center; height: 75vh; font-family: sans-serif; }
    .hero-card { text-align: center; padding: 40px; background: #1e293b; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
    h1 { font-size: 2.5rem; margin-bottom: 15px; color: #38bdf8; }
    p { color: #94a3b8; margin-bottom: 30px; line-height: 1.6; }
    .google-btn { background: #ffffff; color: #0f172a; border: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; cursor: pointer; transition: background 0.2s; }
    .google-btn:hover { background: #e2e8f0; }
  `]
})
export class LandingComponent {
  private auth = inject(Auth);
  private router = inject(Router);
  private taskService = inject(TaskService);

  async login() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    if (result.user) {
      this.router.navigate(['/dashboard']);
    }
  }
}