import { Component, OnInit, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalenderService } from '../calender'; // Assuming 'CalenderService' is correct
import { TaskList } from '../calender-interface'; // Assuming 'calender-interface' is correct
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [],
  templateUrl: './goals.html',
  styleUrl: './goals.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Goals implements OnInit {
  private route = inject(ActivatedRoute);
  private calendar = inject(CalenderService);

  taskList = toSignal(this.route.data.pipe(
    map(data => data['taskList'])
  ));

  newGoalName = signal('');

  ngOnInit(): void {
    console.log('Task list signal:', this.taskList());
  }

  onConfirm(): void {
    console.log("Button clicked.");
    const user = this.calendar.userState();
    if (user) {
      this.calendar.saveStateToStorage(user);
    }
  }
}