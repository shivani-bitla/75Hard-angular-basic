import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StartDate } from "./start-date/start-date";

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet, StartDate],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
