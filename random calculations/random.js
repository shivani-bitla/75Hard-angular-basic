import fs from 'fs';

/**
 * @typedef {'complete' | 'untouched'} TaskStatus
 * @typedef {{ id: number, status: TaskStatus }} Task
 * @typedef {{ id: number, name: string, order: number }} TaskList
 * @typedef {{ date: string, tasks: Task[] }} DayData
 * @typedef {{ username: string, calendarData: DayData[], taskList: TaskList[] }} DaysCalender
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

  const numRandomDays = getRandomInt(3, 70);
  const startDate = new Date();
  startDate.setDate(today.getDate() - numRandomDays);
  startDate.setHours(0, 0, 0, 0);
  let randomStatus='untouched';
  console.log('Generating data starting from:', startDate.toISOString());

  // Generate random data for past and current days
  for (let i = 0; i < numDays; i++) {
    const randomDate = new Date(startDate);
    randomDate.setDate(startDate.getDate() + i);
    randomDate.setHours(0, 0, 0, 0);

    const tasks = taskList.map(task => {
      if (randomDate < today) {
        randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      }
      return {
        id: task.id,
        status: randomStatus
      };
    });

    calendarData.push({
      date: randomDate.toISOString(),
      tasks: tasks
    });
  }

  // // Generate fixed data for future days
  // const startFixedDate = new Date(today);

  // for (let i = 0; i < numDays - numRandomDays; i++) {
  //   const futureDate = new Date(startFixedDate);
  //   futureDate.setDate(startFixedDate.getDate() + i);

  //   const fixedTasks = taskList.map(task => ({
  //     id: task.id,
  //     status: 'untouched'
  //   }));

  //   calendarData.push({
  //     date: futureDate.toISOString(),
  //     tasks: fixedTasks
  //   });
  // }

  return {
    username,
    calendarData,
    taskList
  };
}

/**
 * Generates mock data and saves it to a JSON file.
 * @param {string} username The username for the calendar.
 * @param {string} filename The name of the file to save (e.g., 'calender-data.json').
 */
function saveMockCalendarToJson(username, filename) {
  const calendar = getMockCalendar(username);
  const jsonString = JSON.stringify(calendar, null, 2);

  fs.writeFile(filename, jsonString, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log(`Successfully saved mock data to ${filename}`);
    }
  });
}

saveMockCalendarToJson('joe', './calender-data.json');
