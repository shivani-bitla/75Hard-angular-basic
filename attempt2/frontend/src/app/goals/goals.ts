import { Component, OnInit,ChangeDetectorRef,inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenerateCalenderService } from '../generate-calender';
import { DayWithTaskNames } from '../day-resolver';
import { DayData, Task } from '../days-calender';


@Component({
  selector: 'app-goals',
  imports: [],
  templateUrl: './goals.html',
  styleUrl: './goals.css'
})
export class Goals implements OnInit {
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private calenderService = inject(GenerateCalenderService);
  
  dayWithTaskNames: DayWithTaskNames  | undefined;

  constructor() {
    console.log('Day component initialized'); // Debug log  
  }
  
  dayData: DayData | undefined;
  displayTasks: (Task & { name: string; order: number })[] = [];

  ngOnInit(): void {
    // Access the resolved data
    this.route.data.subscribe(data => {
      this.dayWithTaskNames = data['dayWithTaskNames'];
      console.log('Resolved day data:', this.dayWithTaskNames);
    });
  }

}
