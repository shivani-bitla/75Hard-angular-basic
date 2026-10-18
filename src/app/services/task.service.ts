import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc 
} from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';

export interface TaskConfig {
  id: string;
  name: string;
}

export type TaskLogs = Record<string, Record<string, boolean>>;

export interface UserData {
  startDate: string;
  tasksConfig: TaskConfig[];
  logs: TaskLogs;
  username?: string;
  displayName?: string;
  onboarded?: boolean; 
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  
  // Expose current auth user as an observable
  user$ = user(this.auth);

  private getDefaultTasks(): TaskConfig[] {
    return [
      { id: 'task-1', name: '45 mins outdoor workout' },
      { id: 'task-2', name: '45 mins indoor workout' },
      { id: 'task-3', name: 'Follow a meal plan' },
      { id: 'task-4', name: 'Drink 1 gallon of water' },
      { id: 'task-5', name: 'Journal for 10 minutes' },
      { id: 'task-6', name: 'Read for 5 pages' }
    ];
  }

  // ---------------------------------------------------------------------------
  // CHALLENGE & LOGGING METHODS
  // ---------------------------------------------------------------------------

  // Fetch user data document from Firestore, or initialize it if it's their first time
  async getUserData(userId: string): Promise<UserData> {
    try {
      const docRef = doc(this.firestore, `users/${userId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as unknown as UserData;
      } else {
        const currentUser = this.auth.currentUser;
        const emailPrefix = currentUser?.email 
          ? currentUser.email.split('@')[0].toLowerCase() 
          : `user_${userId.substring(0, 5)}`;
        
        const initialData: UserData = {
          startDate: new Date().toLocaleDateString('en-CA'),
          tasksConfig: this.getDefaultTasks(),
          logs: {},
          username: emailPrefix,
          displayName: currentUser?.displayName || 'Challenger',
          onboarded: false // <-- Triggers onboarding modal for new users
        };
        await setDoc(docRef, initialData);
        return initialData;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  // Save onboarding setup (start date, customized tasks, and set onboarded to true)
  async completeOnboarding(userId: string, startDate: string, tasksConfig: TaskConfig[]): Promise<void> {
    const docRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(docRef, {
      startDate,
      tasksConfig,
      onboarded: true
    });
  }

  // Update a task's display name globally using its unique ID
  async updateTaskName(userId: string, taskId: string, newName: string, currentTasks: TaskConfig[]): Promise<TaskConfig[]> {
    const updatedTasks = currentTasks.map(t => t.id === taskId ? { ...t, name: newName } : t);
    const docRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(docRef, { tasksConfig: updatedTasks });
    return updatedTasks;
  }

  // Save completion state for a specific task ID on a given date string (YYYY-MM-DD)
  async updateTaskLog(userId: string, dateStr: string, taskId: string, completed: boolean, currentLogs: TaskLogs): Promise<TaskLogs> {
    const updatedLogs: TaskLogs = {
      ...currentLogs,
      [dateStr]: {
        ...(currentLogs[dateStr] || {}),
        [taskId]: completed
      }
    };
    const docRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(docRef, { logs: updatedLogs });
    return updatedLogs;
  }

  // Update the challenge start date
  async updateStartDate(userId: string, newDate: string): Promise<void> {
    const docRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(docRef, { startDate: newDate });
  }

  // Clear all challenge logs for a fresh reset
  async resetProgress(userId: string): Promise<void> {
    const docRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(docRef, { logs: {} });
  }

  // ---------------------------------------------------------------------------
  // FRIENDS & ACCOUNTABILITY NETWORK METHODS
  // ---------------------------------------------------------------------------

  // 1. Search for a user by their unique username
  async searchUserByUsername(username: string): Promise<{ uid: string; displayName: string; username: string } | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('username', '==', username.trim().toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;
    
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    return {
      uid: docSnap.id,
      displayName: data['displayName'],
      username: data['username']
    };
  }

  // 2. Send a friend request
  async sendFriendRequest(targetUserId: string, currentUser: { uid: string; displayName: string }): Promise<void> {
    const requestRef = doc(this.firestore, `users/${targetUserId}/friendRequests/${currentUser.uid}`);
    await setDoc(requestRef, {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      timestamp: new Date().toISOString()
    });
  }

  // 3. Accept a friend request (adds mutual friendship and clears request)
  async acceptFriendRequest(currentUserId: string, requesterId: string, requesterName: string, currentUserName: string): Promise<void> {
    // Add requester to current user's friends list
    const myFriendRef = doc(this.firestore, `users/${currentUserId}/friends/${requesterId}`);
    await setDoc(myFriendRef, { uid: requesterId, displayName: requesterName });

    // Add current user to requester's friends list (mutual)
    const theirFriendRef = doc(this.firestore, `users/${requesterId}/friends/${currentUserId}`);
    await setDoc(theirFriendRef, { uid: currentUserId, displayName: currentUserName });

    // Delete the pending request
    const requestRef = doc(this.firestore, `users/${currentUserId}/friendRequests/${requesterId}`);
    await deleteDoc(requestRef);
  }

  // 4. Get list of accepted friends and their progress data
  async getFriendsList(userId: string): Promise<any[]> {
    const friendsRef = collection(this.firestore, `users/${userId}/friends`);
    const snapshot = await getDocs(friendsRef);
    
    const friends = [];
    for (const docSnap of snapshot.docs) {
      const friendId = docSnap.data()['uid'];
      const friendData = await this.getUserData(friendId);
      friends.push({
        uid: friendId,
        displayName: docSnap.data()['displayName'],
        data: friendData
      });
    }
    return friends;
  }

  // 5. Get incoming friend requests
  async getFriendRequests(userId: string): Promise<any[]> {
    const requestsRef = collection(this.firestore, `users/${userId}/friendRequests`);
    const snapshot = await getDocs(requestsRef);
    return snapshot.docs.map(doc => doc.data());
  }

  // Update the global tasks configuration list
  async updateTaskConfig(userId: string, tasksConfig: TaskConfig[]): Promise<void> {
    const docRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(docRef, { tasksConfig: tasksConfig });
  }
}