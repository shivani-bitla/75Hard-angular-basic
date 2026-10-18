# 75 Hard Challenge Tracker

This project is a web application built with Angular to help users track their progress through the "75 Hard" challenge.

## Purpose

The main goal of this application is to provide a simple and effective interface for users to:

1.  View their daily tasks for the 75 Hard challenge.
2.  Mark tasks as complete for the current day.
3.  Visualize their progress over the entire 75-day period.

## Architecture

The application follows a standard Angular architecture with a clear separation of concerns:

*   **Components**: The UI is built with three main components:
    *   `DailyLog`: Displays the list of tasks for a specific day and allows the user to check them off.
    *   `ProgressChart`: Shows a 75-day grid, visually indicating which days are fully complete.
    *   `App`: The root component that contains the router outlet to display the other components.
*   **Services**:
    *   `TaskService`: This is the core of the application's client-side logic. It is responsible for:
        *   Managing the application's state (the tasks and the user's progress).
        *   Communicating with a backend server to fetch and save data.
        *   Providing data and methods to the components.
*   **Routing**: The application uses the Angular Router to navigate between the `DailyLog` view (which is parameterized by date) and the `ProgressChart` view.

## How it Works

1.  The user lands on the `ProgressChart`, which shows the 75-day grid.
2.  The user can click on a day to navigate to the `DailyLog` for that specific date.
3.  In the `DailyLog`, the user sees a list of tasks.
4.  As the user checks or unchecks a task, the `DailyLog` component calls the `updateTask` method in the `TaskService`.
5.  The `TaskService` updates the state and sends the change to the backend.
6.  The `ProgressChart` subscribes to changes in the `TaskService` to automatically update the 75-day grid as the user makes progress.

This structure makes the application modular and easy to maintain. The `TaskService` acts as a single source of truth, ensuring data consistency across all components.
