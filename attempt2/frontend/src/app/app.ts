import { Component, inject, Output, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CalenderService } from './calender';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  private calenderService = inject(CalenderService);

  // Directly reference the service's signal
  readonly users = this.calenderService.userState;

  constructor() { 
    console.log("app component loaded");
    console.log("users", this.users());
    console.log("users", this.users()?.length);
    
  }
}
