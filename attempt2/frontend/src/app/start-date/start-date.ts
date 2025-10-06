import { Component, signal, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-start-date',
  imports: [FormsModule, HttpClientModule],
  templateUrl: './start-date.html',
  styleUrl: './start-date.css'
})
export class StartDate {

  private http = inject(HttpClient);
  selectedDate = signal<string | null>(null);
  responseMessage = signal<string>('');

  submitDate() {
    if (!this.selectedDate()) {
      this.responseMessage.set('Please select a date');
      return;
    }

    this.http.post<{ received_date: string }>('http://localhost:8000/receive_date', { input_date: this.selectedDate() })
      .subscribe({
        next: (response) => {
          this.responseMessage.set(`Received: ${response.received_date}`);
        },
        error: () => {
          this.responseMessage.set('Error submitting date');
        }
      });
  }
}
