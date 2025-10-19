import { Routes } from '@angular/router';
import { UserContainer } from './user-container/user-container';
import { DisplayContainer } from './display-container/display-container';
import { UserLogin } from './user-login/user-login';
import { Tasks } from './tasks/tasks';
import { Calender } from './calender/calender';
import { Chat } from './chat/chat';

export const routes: Routes = [
    { path:'/', component:DisplayContainer, title: 'welcome page'},
    { path:'/user', component:UserContainer, title: 'Home Page' },
    { path:'/user/user-login', component:UserLogin, title:'Login page'},
    { path:'/user/tasks', component:Tasks, title:'Daily Tasks page'},
    { path:'/user/calendar', component:Calender, title: 'Calendar page'},
    { path:'/user/chat', component:Chat, title: 'Chat page'},

];
