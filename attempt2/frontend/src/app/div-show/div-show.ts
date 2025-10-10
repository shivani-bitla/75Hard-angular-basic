// src/app/div-show/div-show.ts
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { NgStyle, CommonModule } from '@angular/common';
import { DayStatus } from '../days-calender';

@Component({
  selector: 'div-show',
  imports: [CommonModule, NgStyle],
  template: `
    <button [ngStyle]="currentStyles" (click)="onButtonClick()" [title]="tooltipText">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      width: 50px;       /* Set a fixed width */
      height: 50px;      /* Set a fixed height to make it square */
      border: none;
      color: white;
      font-weight: bold;
      margin: 5px;
      cursor: pointer;
      border-radius: 8px; /* Optional: for a rounded square look */
    }
  `],
  standalone: true
})
export class DivShow implements OnChanges {
  @Input() status: DayStatus = 'untouched'; // Default status for day/task
  @Input() tooltipText: string | undefined; // Optional tooltip text
  currentStyles: { [key: string]: string; } = {};
  @Output() buttonClick = new EventEmitter<void>(); // Renamed for clarity

  onButtonClick(): void {
    this.buttonClick.emit();
  }

  // Lifecycle hook that runs when the input property changes
  ngOnChanges(): void {
    this.setCurrentStyles();
  }

  private setCurrentStyles(): void {
    const colorMap = {
      'complete': '#135E4B',
      'incomplete': '#A1D8B5',
      'untouched': '#CCDCDB',
      'lastLeft': '#4CB572'
    };
    this.currentStyles = { 'background-color': colorMap[this.status] };
  }
}
