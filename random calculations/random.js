import fs from 'fs'; // Import the file system module for Node.js

/**
 * Simple object structures to replace TypeScript interfaces for use in plain JS.
 * @typedef {'complete' | 'untouched'} TaskStatus
 * @typedef {{ id: number, task: string, status: TaskStatus }} Task
 * @typedef {{ date: Date, tasks: Task[] }} DayData
 * @typedef {{ username: string, calendarData: DayData[] }} DaysCalender
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
 * Generates a complete mock calendar for a user, with all data randomized internally.
 * @param {string} username The username for the calendar.
 * @returns {DaysCalender} A mock DaysCalender object.
 */
function getMockCalendar(username) {
  const calendarData = [];
  const numDays = getRandomInt(3,70);
  const statuses = ['complete', 'untouched'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date();
  startDate.setDate(today.getDate() - numDays);
  startDate.setHours(0, 0, 0, 0);

  const existingDates = new Set();

  for (let i = 0; i < numDays; i++) {
    let randomDate;
    let randomTime;

    do {
      randomTime = startDate.getTime() + Math.random() * (today.getTime() - startDate.getTime());
      randomDate = new Date(randomTime);
      randomDate.setHours(0, 0, 0, 0);
    } while (existingDates.has(randomDate.getTime()));

    existingDates.add(randomDate.getTime());

    const numTasks = getRandomInt(0, 6);
    const tasks = [];

    for (let j = 1; j <= numTasks; j++) {
      // const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomStatus = Math.random() < 0.5 ? 'complete' : 'untouched';
      tasks.push({
        id: j,
        task: `Generated task ${j}`,
        status: randomStatus
      });
    }

    calendarData.push({
      date: randomDate,
      tasks: tasks
    });
  }

  calendarData.sort((a, b) => a.date.getTime() - b.date.getTime());

  return {
    username,
    calendarData
  };
}

/**
 * Generates mock data and saves it to a JSON file.
 * @param {string} username The username for the calendar.
 * @param {string} filename The name of the file to save (e.g., 'calender-data.json').
 */
function saveMockCalendarToJson(username, filename) {
    const calendar = getMockCalendar(username);
    const jsonString = JSON.stringify(calendar, null, 2); // The '2' formats the JSON with 2-space indentation

    fs.writeFile(filename, jsonString, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log(`Successfully saved mock data to ${filename}`);
        }
    });
}

// Call the function to generate and save the file
saveMockCalendarToJson('joe', './calender-data.json');
