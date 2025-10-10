import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DivShow } from "./div-show/div-show";

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet, RouterLink, DivShow],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  constructor() { 
    console.log("app component loaded");
  }
}
