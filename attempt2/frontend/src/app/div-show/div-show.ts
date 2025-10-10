// src/app/div-show/div-show.ts
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { NgStyle, CommonModule } from '@angular/common';
import { DayStatus  } from '../days-calender';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'div-show',
  imports: [CommonModule, NgStyle, RouterLink],
  template: `
    <button [ngStyle]="currentStyles"  (click)="onButtonClick()" [title]="tooltipText"  
      [attr.aria-label]="tooltipText" >
      <a [routerLink]="['/day', (tooltipText | date:'yyyy-MM-dd')]" (click)="$event.stopPropagation()" style="text-decoration: none; color: inherit; display: block; width: 100%; height: 100%;">
        <ng-content></ng-content>
      </a>  
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      height: 50px;      /* Set a fixed height to make it square */
      border: none;
      font-weight: bold;
      margin: 5px;
      padding: 0;
      cursor: pointer;
      min-width:50px;
      max-width:300px;       /* Set a fixed width to make it square */
      border-radius: 8px; /* Optional: for a rounded square look */
    }
  `],
  standalone: true
})
export class DivShow implements OnChanges {
  @Input() status: DayStatus = 'untouched'; // Default status for day/task
  @Input() tooltipText: string | undefined  | null; // Optional tooltip text
  currentStyles: { [key: string]: string; } = {};
  @Output() buttonClick = new EventEmitter<void>(); // Renamed for clarity

  onButtonClick(): void {
    this.buttonClick.emit();
  }

  onRouterLink():void{
  }

  // Lifecycle hook that runs when the input property changes
  ngOnChanges(): void {
    this.setCurrentStyles();
  }

  private setCurrentStyles(): void {
    const colorMap = {
      'complete': '#135e4b89',
      'incomplete': '#a1d8b59a',
      'untouched': '#CCDCDB',
      'lastLeft': '#4CB572'
    };
    this.currentStyles = { 'background-color': colorMap[this.status] };
  }
}
