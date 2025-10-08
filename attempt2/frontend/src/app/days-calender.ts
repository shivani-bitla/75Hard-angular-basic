export type DayStatus = 'complete' | 'incomplete' | 'untouched' | 'lastLeft';
export type TaskStatus = 'complete' | 'untouched' ;

export interface Task {
  id: number;
  task: string;
  status: TaskStatus;
}


export interface DayData {
  date: Date;
  tasks: Task[];
}

export interface DaysCalender {
  username: string;
  calendarData: DayData[];
}
