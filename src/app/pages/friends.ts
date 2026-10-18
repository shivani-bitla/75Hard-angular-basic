import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="friends-container">
      <h2>Friends & Accountability</h2>

      <!-- Search Section -->
      <div class="search-box">
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          placeholder="Search username..." 
        />
        <button (click)="searchUser()">Search</button>
      </div>

      @if (searchResult()) {
        <div class="search-result-card">
          <span>Found: {{ searchResult()?.displayName }} (@{{ searchResult()?.username }})</span>
          <button (click)="sendRequest()">Send Friend Request</button>
        </div>
      }

      <!-- Pending Requests Section -->
      <div class="requests-section">
        <h3>Pending Requests</h3>
        @if (pendingRequests().length === 0) {
          <p>No pending requests.</p>
        }
        @for (req of pendingRequests(); track req['uid']) {
          <div class="request-item">
            <span>{{ req['displayName'] }} wants to be your accountability partner.</span>
            <button (click)="acceptRequest(req['uid'], req['displayName'])">Accept</button>
          </div>
        }
      </div>

      <!-- Friends List & Progress Inspection -->
      <div class="friends-list-section">
        <h3>My Friends</h3>
        @if (friends().length === 0) {
          <p>No friends added yet. Search a handle above to connect!</p>
        }
        @for (friend of friends(); track friend.uid) {
          <div class="friend-card">
            <h4>{{ friend.displayName }}</h4>
            <p>Start Date: {{ friend.data.startDate }}</p>
            
            <!-- Mini Progress View for Friend -->
            <div class="friend-mini-grid">
              @for (day of getFriendProgressDays(friend.data); track day.dateStr) {
                <div class="mini-box" [class.completed]="day.allDone" [title]="day.dateStr"></div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .friends-container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; font-family: sans-serif; }
    .search-box { display: flex; gap: 10px; margin-bottom: 15px; }
    .search-box input { flex: 1; padding: 8px; }
    .search-result-card, .request-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f9f9f9; margin-bottom: 10px; border-radius: 4px; }
    .friend-card { background: #f1f3f5; padding: 15px; border-radius: 6px; margin-bottom: 15px; }
    .friend-mini-grid { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 8px; }
    .mini-box { width: 12px; height: 12px; background: #dee2e6; border-radius: 2px; }
    .mini-box.completed { background: #40c057; }
  `]
})
export class FriendsComponent implements OnInit {
  private taskService = inject(TaskService);
  
  currentUser = signal<User | null>(null);
  searchQuery = '';
  searchResult = signal<any | null>(null);
  pendingRequests = signal<any[]>([]);
  friends = signal<any[]>([]);

  async ngOnInit() {
    this.taskService.user$.subscribe(async (user) => {
      const typedUser = user as User | null;
      this.currentUser.set(typedUser);
      if (typedUser) {
        await this.loadFriendData(typedUser.uid);
      }
    });
  }

  async loadFriendData(uid: string) {
    const requests = await this.taskService.getFriendRequests(uid);
    this.pendingRequests.set(requests);

    const acceptedFriends = await this.taskService.getFriendsList(uid);
    this.friends.set(acceptedFriends);
  }

  async searchUser() {
    if (!this.searchQuery.trim()) return;
    const result = await this.taskService.searchUserByUsername(this.searchQuery);
    this.searchResult.set(result);
  }

  async sendRequest() {
    const user = this.currentUser();
    const target = this.searchResult();
    if (!user || !target) return;

    await this.taskService.sendFriendRequest(target.uid, {
      uid: user.uid,
      displayName: user.displayName || 'Challenge Partner'
    });
    alert('Friend request sent!');
    this.searchResult.set(null);
    this.searchQuery = '';
  }

  async acceptRequest(requesterUid: string, requesterName: string) {
    const user = this.currentUser();
    if (!user) return;

    await this.taskService.acceptFriendRequest(
      user.uid, 
      requesterUid, 
      requesterName, 
      user.displayName || 'Challenge Partner'
    );
    await this.loadFriendData(user.uid);
  }

  // Helper to map out a friend's 75 days to render a visual mini grid
  getFriendProgressDays(friendData: any) {
    if (!friendData || !friendData.startDate) return [];
    const days = [];
    const startDateObj = new Date(friendData.startDate);
    const totalTasks = friendData.tasksConfig?.length || 6;

    for (let i = 0; i < 75; i++) {
      const current = new Date(startDateObj);
      current.setDate(startDateObj.getDate() + i);
      const dateStr = current.toLocaleDateString('en-CA');

      const dayLogs = friendData.logs?.[dateStr] || {};
      const completedCount = Object.values(dayLogs).filter(Boolean).length;
      const allDone = completedCount === totalTasks;

      days.push({ dateStr, allDone });
    }
    return days;
  }
}