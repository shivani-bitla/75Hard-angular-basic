import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './service/auth';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class App {
  protected readonly title = signal('frontend');
  private authService = inject(AuthService);
  
  // Hold the auth state observable
  user$: Observable<User | null> = this.authService.authState$;

  loginWithGoogle() {
    this.authService.signInWithGoogle().catch((error) => {
      console.error('Login failed:', error);
    });
  }

  logout() {
    this.authService.signOut();
  }
}
