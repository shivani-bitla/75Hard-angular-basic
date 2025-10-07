import { Component, signal } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Days } from './days/days';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet, Days],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
