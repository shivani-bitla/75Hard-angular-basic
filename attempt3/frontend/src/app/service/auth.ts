import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  
  // Observable to track the current user's authentication state
  // Emits the User object when logged in, or null when logged out
  public readonly authState$: Observable<User | null> = authState(this.auth);

  // --- Email/Password Methods ---

  signUp(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signIn(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // --- Google Sign-In ---

  signInWithGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  // --- Sign Out ---

  signOut(): Promise<void> {
    return signOut(this.auth);
  }
}