import { Injectable } from '@angular/core';
import { DaysCalender, DayData, Task } from './days-calender';
import { TaskStatus } from './day-tasks';

@Injectable({
  providedIn: 'root'
})
export class GenerateCalenderService {
  constructor() { }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomDate(start: Date, end: Date): Date {
    const startTimestamp = start.getTime();
    const endTimestamp = end.getTime();
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    return new Date(randomTimestamp);
  }

  
  getMockCalendar(username: string): DaysCalender {
    const calendarData: DayData[] = [];
    const numDays = this.getRandomInt(0,90); // Random number of days between 0 and 90
    const statuses: TaskStatus[] = ['complete', 'untouched'];

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 30);

    for (let i = 0; i < numDays; i++) {
      const randomDate = this.getRandomDate(startDate, today);
      const numTasks = this.getRandomInt(0,6); // Random number of tasks between 0 and 6
      const tasks: Task[] = [];

      for (let j = 1; j <= numTasks; j++) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        tasks.push({
          id: j,
          task: `Generated task ${j}`,
          status: randomStatus
        });
      }

      calendarData.push({
        date: randomDate,
        tasks: tasks
      });
    }
    
    // Sort the tasks chronologically by date
    calendarData.sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      username,
      calendarData
    };
  }
}
