const daysContainer = document.querySelector(".days"),
  nextBtn = document.querySelector(".next-btn"),
  prevBtn = document.querySelector(".prev-btn"),
  month = document.querySelector(".month"),
  todayBtn = document.querySelector(".today-btn");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let selectedDateElement = null; // Store the currently selected element

let selectedDate = null;
let selectedTime = null;

// Render the calendar
function renderCalendar() {
  date.setDate(1);
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const lastDayIndex = lastDay.getDay();
  const lastDayDate = lastDay.getDate();
  const prevLastDay = new Date(currentYear, currentMonth, 0);
  const prevLastDayDate = prevLastDay.getDate();
  const nextDays = 7 - lastDayIndex - 1;

  month.innerHTML = `${months[currentMonth]} ${currentYear}`;

  let daysHTML = "";

  for (let x = firstDay.getDay(); x > 0; x--) {
    daysHTML += `<div class="day prev">${prevLastDayDate - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDayDate; i++) {
    if (
      i === new Date().getDate() &&
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
    ) {
      daysHTML += `<div class="day today">${i}</div>`;
    } else {
      daysHTML += `<div class="day">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    daysHTML += `<div class="day next">${j}</div>`;
  }

  daysContainer.innerHTML = daysHTML;
  hideTodayBtn();
  addDayClickListeners();
}

// Add click listeners for days
function addDayClickListeners() {
    const allDays = document.querySelectorAll(".day");
  
    allDays.forEach((day) => {
      day.addEventListener("click", () => {
        if (day.classList.contains("prev") || day.classList.contains("next")) {
          return; // Ignore clicks on previous or next month days
        }
  
        // Remove the `selected` class from the previously selected element
        if (selectedDateElement) {
          selectedDateElement.classList.remove("selected");
        }
  
        // Format the selected date as YYYY-MM-DD
        selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day.textContent).padStart(2, '0')}`;
        console.log("Selected Date (Formatted):", selectedDate);
  
        // Highlight the new selected date
        day.classList.add("selected");
        selectedDateElement = day;
      });
    });
  }
  

// Add event listeners to time slots
function addTimeSlotListeners() {
  const timeSlots = document.querySelectorAll(".time-section div");

  timeSlots.forEach((slot) => {
    slot.addEventListener("click", () => {
      // Skip if the time slot is already inactive
      if (slot.classList.contains("inactive")) {
        return;
      }

      // Mark the slot as inactive and change its appearance
      slot.classList.add("inactive");
      slot.style.backgroundColor = "#dcdcdc";
      slot.style.color = "#888";
      slot.style.cursor = "not-allowed";

      // Set the selected time
      selectedTime = slot.textContent;
      console.log("Selected Time:", selectedTime);
    });
  });
}

// Function to reset all time slots to available state
function resetTimeSlots() {
  const timeSlots = document.querySelectorAll(".time-section div");

  timeSlots.forEach((slot) => {
    if (slot.classList.contains("inactive")) {
      slot.classList.remove("inactive");
      slot.style.backgroundColor = "#3a85ff";  // Reset to original color
      slot.style.color = "white";              // Reset text color
      slot.style.cursor = "pointer";           // Make it clickable again
    }
  });

  // Reset selected time
  selectedTime = null;
  console.log("Time slots reset. No time selected.");
}

// Event listener for the cancel button to reset time slots
const cancelBtn = document.querySelector(".cancel-btn");
if (cancelBtn) {
  cancelBtn.addEventListener("click", resetTimeSlots);
}

// Function to hide/show the "Today" button
function hideTodayBtn() {
  if (
    currentMonth === new Date().getMonth() &&
    currentYear === new Date().getFullYear()
  ) {
    todayBtn.style.display = "none";
  } else {
    todayBtn.style.display = "flex";
  }
}

// Handle navigation between months
nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

prevBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

// Go to today's date
todayBtn.addEventListener("click", () => {
  currentMonth = date.getMonth();
  currentYear = date.getFullYear();
  renderCalendar();
});

// Initialize the calendar
renderCalendar();
addTimeSlotListeners();

// Handle booking
const bookBtn = document.querySelector(".book-btn");
if (bookBtn) {
  bookBtn.addEventListener("click", () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both a date and a time.");
      return;
    }

    // Send the selected date and time to the PHP backend
    const appointmentData = {
      date: selectedDate,
      time: selectedTime
    };

    console.log("Booking Appointment:", appointmentData);

    // Make an HTTP POST request to the PHP backend (book-appointment.php)
    fetch("book-appointment.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Appointment booked successfully!");
      } else {
        alert("Failed to book appointment. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error booking appointment:", error);
      alert("An error occurred. Please try again.");
    });
  });
}
