import { Component, OnInit } from '@angular/core';
import { DivShow } from '../div-show/div-show';
import { NgFor } from '@angular/common';
import { DaysCalender, DayStatus,DayData } from '../days-calender';
import { GenerateCalenderService } from '../generate-calender';



@Component({
  selector: 'app-days',
  imports: [DivShow, NgFor],
  templateUrl: './days.html',
  styleUrl: './days.css'
})
export class Days implements OnInit {
  calendar!: DaysCalender;
  completeStatus='complete';
  days=this.calendar.calendarData

  // Inject the new service in the constructor
  constructor(private generateCalenderService: GenerateCalenderService) { }

  ngOnInit(): void {
    // Call the service method with the correct name
    const currentUser = 'JohnDoe';
    this.calendar = this.generateCalenderService.getMockCalendar(currentUser);
  }
  getDayStatus(day: DayData, status: string): DayStatus {
    const count = day.tasks.filter(task => task.status === status).length;
    switch (count) {
      case 0:
        return 'untouched';
      case 5:
        return 'lastLeft';
      case 6:
        return 'complete';
      default:
        return 'incomplete';
    }
  }
}