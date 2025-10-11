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
// // New, focused interface for the calendar data
// export interface DaysCalender {
//   // username is no longer here
//   calendarData: DayData[];
//   taskList: TaskList[];
// }

// // Separate interface for user data
// export interface User {
//   username: string;
//   // Other potential user details
//   email: string;
//   id: string;
//   // Nest the calendar interface, as the calendar belongs to a user
//   calendar: DaysCalender;
// }
