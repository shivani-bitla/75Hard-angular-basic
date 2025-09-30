import { formatDate } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  selectedDate: string | null = null;
  responseMessage: string = '';

  constructor(private http: HttpClient) {}

  submitDate() {
    if (!this.selectedDate) {
      this.responseMessage = 'Please select a date';
      return;
    }

    this.http.post('http://localhost:8000/receive_date', { input_date: this.selectedDate })
      .subscribe({
        next: (response: any) => {
          this.responseMessage = `Received: ${response.received_date}`;
        },
        error: () => {
          this.responseMessage = 'Error submitting date';
        }
      });
    }
}
