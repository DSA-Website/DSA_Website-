const events = {
  // August 2025
  "2025-08-25": {
    title: "Semester Starts",
    details: "Welcome back! Classes begin for the Fall semester."
  },
  "2025-08-29": {
    title: "General Meeting #1",
    details: "Join us for our first general meeting of the semester!"
  },

  // September 2025
  "2025-09-01": {
    title: "Labor Day - No Classes",
    details: "Campus is closed in observance of Labor Day."
  },
  "2025-09-08": {
    title: "Bakesale #1",
    details: "Support our fundraising on Speedway, 10am–2pm."
  },
  "2025-09-25": {
    title: "Tea/Coffee Night",
    details: "Relaxing evening with hot drinks and conversation."
  },

  // October 2025
  "2025-10-01": {
    title: "General Meeting #2",
    details: "Second general meeting for DSA members."
  },
  "2025-10-07": {
    title: "Bakesale #2",
    details: "Find us on Speedway with more delicious treats."
  },
  "2025-10-15": {
    title: "Philanthropy Event",
    details: "A special service event—details TBA."
  },
  "2025-10-20": {
    title: "Tea/Coffee Night",
    details: "Another cozy night with snacks and hot drinks."
  },

  // November 2025
  "2025-11-06": {
    title: "Picnic",
    details: "Join us for a chill outdoor get-together."
  },
  "2025-11-18": {
    title: "Thanksgiving Dinner",
    details: "Potluck-style dinner with DSA family!"
  },
  "2025-11-24": {
    title: "Thanksgiving Break",
    details: "Break week begins. No classes."
  },
  "2025-11-25": {
    title: "Thanksgiving Break",
    details: "Break continues."
  },
  "2025-11-26": {
    title: "Thanksgiving Break",
    details: "Break continues."
  },
  "2025-11-27": {
    title: "Thanksgiving Break",
    details: "Thanksgiving Day. No classes."
  },

  // December 2025
  "2025-12-08": {
    title: "Last Class Day",
    details: "Final day of instruction for the semester."
  },
  "2025-12-11": {
    title: "Finals",
    details: "Final exams begin!"
  },
  "2025-12-12": {
    title: "Finals",
    details: "Final exams continue."
  },
  "2025-12-13": {
    title: "Finals",
    details: "Final exams continue."
  },
  "2025-12-15": {
    title: "Finals",
    details: "Final exam week continues."
  }
};

const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
const eventPopup = document.getElementById('eventPopup');
const eventDetails = document.getElementById('eventDetails');
const closePopup = document.getElementById('closePopup');
let currentDate = new Date(); // Automatically sets it to the current month and year


function renderCalendar() {
  calendar.innerHTML = ''; // 💥 This clears previous DOM content

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();

  monthYear.textContent = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysOfWeek.forEach(day => {
    const cell = document.createElement('div');
    cell.className = 'day-name';
    cell.textContent = day;
    calendar.appendChild(cell);
  });

  for (let i = 0; i < startDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'day empty';
    calendar.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    cell.className = 'day';
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const number = document.createElement('div');
    number.className = 'date-number';
    number.textContent = day;
    cell.appendChild(number);

    if (events[dateStr]) {
      const eventEl = document.createElement('div');
      eventEl.className = 'event';
      eventEl.textContent = events[dateStr].title;
      cell.appendChild(eventEl);

      cell.classList.add('has-event');
      cell.addEventListener('click', () => {
        eventDetails.innerHTML = `<h3>${events[dateStr].title}</h3><p>${events[dateStr].details}</p>`;
        eventPopup.classList.add('show');
      });
    }

    calendar.appendChild(cell);
  }
}

document.getElementById('prevMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

closePopup.addEventListener('click', () => {
  eventPopup.classList.remove('show');
});

// Initial render
renderCalendar();
