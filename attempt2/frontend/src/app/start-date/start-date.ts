import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-start-date',
  imports: [],
  templateUrl: './start-date.html',
  styleUrl: './start-date.css'
})
export class StartDate {

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
