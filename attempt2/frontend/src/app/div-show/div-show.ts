
import { Component, Input, OnChanges } from '@angular/core';
import { NgStyle, CommonModule } from '@angular/common';

type Status = 'complete' | 'incomplete' | 'untouched' | 'lastLeft';

@Component({
  selector: 'div-show',
  imports: [CommonModule, NgStyle],
  template: `
    <button [ngStyle]="currentStyles">
      
    </button>
  `,
  styles: [`
    button {
      width: 50px;       /* Set a fixed width */
      height: 50px;      /* Set a fixed height to make it square */
      border: none;
      color: white;
      font-weight: bold;
      cursor: pointer;
      border-radius: 8px; /* Optional: for a rounded square look */
    }
  `]
})
export class DivShow implements OnChanges {
  @Input() status: Status = 'untouched'; // Default status
  currentStyles: { [key: string]: string; } = {};

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

  getButtonText(): string {
    const textMap = {
      'complete': '✓',
      'incomplete': '...',
      'untouched': '○',
      'lastLeft': '!'
    };
    return textMap[this.status];
  }
}