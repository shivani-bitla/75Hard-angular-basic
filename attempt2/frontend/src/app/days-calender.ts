export type TaskStatus = 'complete' | 'untouched';

export type DayStatus = 'complete' | 'incomplete' | 'untouched' | 'lastLeft';

export interface Task {
  id: number;
  status: TaskStatus;
}

export interface TaskList {
  id: number; // Added an ID for consistency and referencing
  name: string;
  order: number;
}

export interface DayData {
  date: Date;
  tasks: Task[];
}

export interface DaysCalender {
  username: string;
  calendarData: DayData[];
  taskList: TaskList[];
}
