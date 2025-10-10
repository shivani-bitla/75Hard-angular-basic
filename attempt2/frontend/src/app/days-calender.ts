// src/app/days-calender.ts

// The possible statuses for a task on a given day.
export type TaskStatus = 'complete' | 'untouched';

// The overall status of a day, derived from its tasks.
export type DayStatus = 'complete' | 'incomplete' | 'untouched' | 'lastLeft';

// A single task's status for a specific day.
export interface Task {
  id: number;
  status: TaskStatus;
}

// The global list of all available tasks, with their names and a defined order.
export interface TaskList {
  id: number; // Added an ID for consistency and referencing
  name: string;
  order: number;
}

// The data for a single calendar day.
export interface DayData {
  date: Date;
  tasks: Task[];
}

// The top-level data structure for the entire calendar.
export interface DaysCalender {
  username: string;
  calendarData: DayData[];
  taskList: TaskList[];
}
