import fs from 'fs';

/**
 * @typedef {'complete' | 'untouched'} TaskStatus
 * @typedef {{ id: number, status: TaskStatus }} Task
 * @typedef {{ id: number, name: string, order: number }} TaskList
 * @typedef {{ date: string, tasks: Task[] }} DayData
 * @typedef {{ calendarData: DayData[], taskList: TaskList[] }} DaysCalender
 * @typedef {{ username: string, email: string, id: string, calendar: DaysCalender }} User
 */

/**
 * Generates a random integer within a specified range (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a mock calendar for a user.
 * @returns {DaysCalender} A mock DaysCalender object.
 */
function getMockCalendar() {
  const calendarData = [];
  const numDays = 90; // Generate data for 90 days total
  const statuses = ['complete', 'untouched'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskNames = [
    'Complete Project Proposal',
    'Attend Team Meeting',
    'Review Code Changes',
    'Prepare Client Presentation',
    'Respond to Emails',
    'Update Documentation'
  ];

  const taskList = taskNames.map((name, index) => ({
    id: index + 1,
    name: name,
    order: index + 1
  }));

  const startDate = new Date();
  startDate.setDate(today.getDate() - 30); // Start 30 days in the past
  startDate.setHours(0, 0, 0, 0);

  // Generate data for past and future days
  for (let i = 0; i < numDays; i++) {
    const currentDay = new Date(startDate);
    currentDay.setDate(startDate.getDate() + i);
    currentDay.setHours(0, 0, 0, 0);
    
    const isPast = currentDay.getTime() < today.getTime();

    const tasks = taskList.map(task => {
      const randomStatus = isPast ? statuses[Math.floor(Math.random() * statuses.length)] : 'untouched';
      return {
        id: task.id,
        status: randomStatus
      };
    });

    calendarData.push({
      date: currentDay.toISOString(),
      tasks: tasks
    });
  }

  return {
    calendarData,
    taskList
  };
}

/**
 * Generates mock data for multiple users and saves it to a JSON file.
 * @param {string[]} usernames An array of usernames for which to generate data.
 * @param {string} filename The name of the file to save (e.g., 'calender-data.json').
 */
function saveMockUsersToJson(usernames, filename) {
  const users = usernames.map((username, index) => {
    const calendar = getMockCalendar();
    return {
      id: `user${index + 1}`,
      username: username,
      email: `${username.toLowerCase()}@example.com`,
      calendar: calendar
    };
  });

  const jsonString = JSON.stringify(users, null, 2);

  fs.writeFile(filename, jsonString, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log(`Successfully saved mock user data to ${filename}`);
    }
  });
}

// Generate and save data for multiple users
saveMockUsersToJson(['joe', 'jane', 'admin'], './calender-data.json');
