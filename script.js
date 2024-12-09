const daysContainer = document.querySelector(".days"),
  nextBtn = document.querySelector(".next-btn"),
  prevBtn = document.querySelector(".prev-btn"),
  month = document.querySelector(".month"),
  todayBtn = document.querySelector(".today-btn");

const months = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
];

const date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let selectedDateElement = null; // Store the currently selected element
let selectedDate = null;
let selectedTime = null;
let appointments = [];  // Declare appointments here

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
    const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    if (i === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
      daysHTML += `<div class="day today" data-date="${fullDate}">${i}</div>`;
    } else {
      daysHTML += `<div class="day" data-date="${fullDate}">${i}</div>`;
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

      // If the clicked day is already selected, deselect it
      if (day.classList.contains("selected")) {
        day.classList.remove("selected");
        selectedDate = null; // Clear the selected date
        selectedDateElement = null; // Clear the reference
        console.log("Date deselected");
        resetTimeSlots();
        return;
      }

      // Remove the `selected` class from the previously selected element
      if (selectedDateElement) {
        selectedDateElement.classList.remove("selected");
      }

      // Format the selected date as YYYY-MM-DD
      selectedDate = day.getAttribute('data-date');
      console.log("Selected Date (Formatted):", selectedDate);

      // Highlight the new selected date
      day.classList.add("selected");
      selectedDateElement = day;

      // Reset and mark time slots
      resetTimeSlots();
      markUnavailableDates();
    });
  });
}

// Function to reset all time slots to available state
function resetTimeSlots() {
  const timeSlots = document.querySelectorAll(".time-section div");

  timeSlots.forEach((slot) => {
    if (slot.classList.contains("inactive")) {
      slot.classList.remove("inactive");
      slot.style.backgroundColor = "var(--primary-color)";
      slot.style.color = "#fff";                            
      slot.style.pointerEvents = "auto";                    
    }

    // Reattach the click event to time slots after reset
    slot.addEventListener("click", timeSlotClickListener);
  });

  // Reset selected time
  selectedTime = null;
  console.log("Time slots reset. No time selected.");
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

// Function to mark unavailable dates and times based on fetched data
function markUnavailableDates() {
  console.log("Marking unavailable dates...");
  appointments.forEach((appointment) => {
    const { Appointment_date, Appointment_time } = appointment;
    const appointmentDateOnly = Appointment_date.split(" ")[0]; // Get only the date part (YYYY-MM-DD)

    console.log(`Checking for appointment on ${appointmentDateOnly} at ${Appointment_time}`);

    // Disable unavailable time slots for the selected date
    if (selectedDate === appointmentDateOnly) {
      const timeElement = document.querySelector(`.time-section div[data-time="${Appointment_time.substring(0, 5)}"]`);
      if (timeElement) {
        console.log(`Disabling time slot: ${Appointment_time}`);
        timeElement.classList.add('inactive');
        timeElement.style.pointerEvents = 'none'; // Make time slot unclickable
        timeElement.style.backgroundColor = "gray"; // Disable time slot visually
        timeElement.style.color = "darkgray"; // Change text color for inactive slot
      }
    }
  });
}

// Fetch appointments from the server
function fetchAppointments() {
  fetch("getAppointments.php")
    .then(response => response.json())
    .then(data => {
      console.log(data); // Check if the data is correct

      // Assign the fetched appointments to the appointments array
      appointments = data;

      markUnavailableDates(); // Call the function to disable dates/times
    })
    .catch(error => console.error("Error fetching appointments:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  const bookBtn = document.getElementById("book-btn");

  // Function to enable the book button when a date and time are selected
  function enableBookButton() {
    if (selectedDate && selectedTime) {
      bookBtn.disabled = false;
    } else {
      bookBtn.disabled = true;
    }
  }

  bookBtn.addEventListener("click", () => {
    if (selectedDate && selectedTime) {
      const appointmentData = {
        date: selectedDate,
        time: selectedTime
      };
  
      fetch("bookAppointment.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(appointmentData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Show the custom confirmation dialog
            openDialog();
  
            // Optionally update dialog content dynamically
            document.querySelector("#confirmationDialog h2").textContent = "Thank you!";
            document.querySelector(
              "#confirmationDialog p"
            ).textContent = `Your booking for ${selectedDate} at ${selectedTime} has been confirmed. 😊`;
  
            fetchAppointments();
          } else {
            alert(data.message);
          }
  
          resetSelection();
        })
        .catch(error => {
          console.error("Error booking appointment:", error);
          alert("There was an error booking your appointment.");
        });
    }
  });
  
  function resetSelection() {
    selectedDate = null;
    selectedTime = null;
    if (selectedDateElement) {
      selectedDateElement.classList.remove("selected");
    }
    resetTimeSlots();
    enableBookButton();
  }
  fetchAppointments();
});

const cancelBtn = document.getElementById("cancel-btn");

cancelBtn.addEventListener("click", () => {
  if (selectedTime) {
    const selectedTimeSlot = document.querySelector(`.time-section div[data-time="${selectedTime}"]`);
    if (selectedTimeSlot) {
      selectedTimeSlot.style.backgroundColor = "var(--primary-color)";
      selectedTimeSlot.style.color = "#fff"; 
    }

    selectedTime = null;
    console.log("Time selection canceled");

    enableBookButton();
    
    cancelBtn.disabled = true;
  }
});

function timeSlotClickListener(event) {
  const timeSlot = event.target;
  if (timeSlot.classList.contains("inactive")) {
    return;
  }

  if (selectedTime === timeSlot.getAttribute("data-time")) {
    selectedTime = null;
    timeSlot.style.backgroundColor = "";
    timeSlot.style.color = "";
    console.log("Time slot unselected.");
    return;
  }

  if (selectedTime) {
    const previouslySelected = document.querySelector(
      `[data-time="${selectedTime}"]`
    );
    if (previouslySelected) {
      previouslySelected.style.backgroundColor = "";
      previouslySelected.style.color = "";
    }
  }

  selectedTime = timeSlot.getAttribute("data-time");
  timeSlot.style.backgroundColor = "gray";
  timeSlot.style.color = "#fff";
  console.log(`Time slot selected: ${selectedTime}`);
}


function enableBookButton() {
  const bookBtn = document.getElementById("book-btn");
  if (selectedDate && selectedTime) {
    bookBtn.disabled = false;
  } else {
    bookBtn.disabled = true;
  }
}

/* DIALOG BOX */

function closeDialog() {
  const dialog = document.getElementById("confirmationDialog");
  dialog.style.display = "none";
}

// To open the dialog
function openDialog() {
  const dialog = document.getElementById("confirmationDialog");
  dialog.style.display = "flex";
}


