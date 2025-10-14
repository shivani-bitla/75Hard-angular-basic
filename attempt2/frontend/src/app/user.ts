import { DaysCalender } from "./calender-interface";

export interface User {
  username: string;
  email: string;
  id: string;
  calendar: DaysCalender;
}
