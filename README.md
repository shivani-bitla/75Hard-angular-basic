# 75 Hard Tracker

Angular + Firebase app for tracking a daily habit challenge. Each user sets a start date and a task list, ticks tasks off per day, and can add friends to see their progress.

## Stack

- Angular 20 (standalone components, lazy-loaded routes, functional guard)
- AngularFire: Firebase Auth + Firestore
- Karma/Jasmine (default setup, no tests written)

## Structure

```
src/app/
  pages/
    landing.ts              sign-in
    onboarding.ts           first-run: start date + tasks
    challenge-dashboard.ts  daily checklist + progress
    task-edit.ts            rename/edit tasks
    friends.ts              search users, requests, friends' progress
  services/
    task.service.ts         all Firestore reads/writes
    auth.guard.ts           blocks /dashboard and /friends when signed out
```

## Data model

One document per user at `users/{uid}`:

```ts
interface UserData {
  startDate: string;                              // YYYY-MM-DD
  tasksConfig: { id: string; name: string }[];
  logs: Record<string, Record<string, boolean>>;  // logs[date][taskId]
  username?: string;
  displayName?: string;
  onboarded?: boolean;
}
```

New users get 6 default tasks and `onboarded: false`, which opens the onboarding step.

## Run

```bash
npm install
npm start          # http://localhost:4200
```

Firebase config is in `src/app/environments/environment.ts`.

## Known issues

- Rules in `firestore.rules` must be deployed: `firebase deploy --only firestore:rules`. Signed-in users can read all profiles (needed for friend search).
- `project_explanation.md` and `code_snippets.ts` describe an older version (DailyLog, ProgressChart, HttpClient backend). Out of date.
- No unit tests.
