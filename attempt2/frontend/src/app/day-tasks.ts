export type TaskStatus = 'complete' | 'untouched' ;

export interface Task {
  id: number;
  task: string;
  status: TaskStatus;
}

export interface DayTasks {
  [day: string]: Task[];
}