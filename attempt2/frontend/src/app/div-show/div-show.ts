// src/app/div-show/div-show.ts
import { Component, EventEmitter, input, Input, OnChanges, Output } from '@angular/core';
import { NgStyle, CommonModule } from '@angular/common';
import { DayData, DayStatus  } from '../days-calender';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'div-show',
  imports: [CommonModule, NgStyle, RouterLink],
  template: `
    <button [ngStyle]="currentStyles"  (click)="onButtonClick()" [title]="tooltipText"  
      [attr.aria-label]="tooltipText" >
      <a [routerLink]="disable? null:['/day/', (dateFormated)]" (click)="disable?null:($event.stopPropagation())">
        <ng-content></ng-content>
      </a>  
    </button>
  `,
  styles: [`
    button {
      height: 40px;
      border: none;
      padding: 0;
      cursor: pointer;
      min-width:40px;
      max-width:300px;      
      border-radius: 8px; 
      grid-row: 1 / -1;
      grid-column: 1 / -1;
    }
    a{
      padding-top:5px;
      font-weight:300;
      text-decoration: none; 
      color: inherit; 
      display: block; 
      width: 100%; 
      height: 35px;
    }
  `],
  standalone: true
})
export class DivShow implements OnChanges {
  @Input() status: DayStatus = 'untouched'; // Default status for day/task
  @Input() tooltipText: string | undefined  | null; // Optional tooltip text
  currentStyles: { [key: string]: string; } = {};
  @Input() dateUnformat: DayData | undefined | null; // Date format for router link
  @Output() buttonClick = new EventEmitter<void>(); // Renamed for clarity
  @Input() dateFormated: string | undefined | null;
  @Input()  disable:boolean|null|undefined=false;
  
  constructor() {
  }

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
