import { Component, input } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-user-login',
  imports: [],
  templateUrl: './user-login.html',
  styleUrl: './user-login.less'
})
export class UserLogin {
  user =input.required<User>();
}
