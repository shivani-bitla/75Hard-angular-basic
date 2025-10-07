import { TaskStatus } from './day-tasks';

export interface Task {
  id: number;
  task: string;
  status: TaskStatus;
}

export type DayStatus = 
    'complete' | 'incomplete'   
    | 'untouched' | 'lastLeft';

export interface DayData {
  date: Date;
  tasks: Task[];
}

export interface DaysCalender {
  username: string;
  calendarData: DayData[];
}
