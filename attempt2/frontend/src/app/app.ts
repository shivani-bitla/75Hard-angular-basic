import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DivShow } from './div-show/div-show';
import { Days } from './days/days';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet,DivShow,Days],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
