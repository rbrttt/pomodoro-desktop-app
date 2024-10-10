const { ipcRenderer } = require('electron');

// Existing variables and timer setup...
let workTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60;  // 5 minutes in seconds
let timeLeft = workTime;
let timer;
let isWorking = true;

const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const breakBtn = document.getElementById('break-btn');
const customizeBtn = document.getElementById('customize-btn');
const settingsBtn = document.getElementById('settings-btn'); // Settings button
const customTimerContainer = document.getElementById('custom-timer-container');
const saveCustomBtn = document.getElementById('save-custom-btn');

// Load the alarm sound
const alarmSound = new Audio('assets/alarm.mp3'); // Path to the alarm sound
alarmSound.volume = 0.5; // Default volume

// Open Settings window
settingsBtn.addEventListener('click', () => {
  console.log("Opening settings window"); // Debugging log
  ipcRenderer.send('open-settings');  // Send an IPC message to open the settings window
});

// Custom input fields
const customWorkTimeInput = document.getElementById('custom-work-time');
const customBreakTimeInput = document.getElementById('custom-break-time');

// Apply settings (e.g., volume) when the app loads
ipcRenderer.on('apply-settings', (event, settings) => {
  alarmSound.volume = settings.alarmVolume; // Apply saved volume
});

// Update the timer display
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Start the Pomodoro timer
startBtn.addEventListener('click', () => {
  if (!timer) {
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        alarmSound.play(); // Play alarm when timer ends
        setTimeout(() => {
          alert(isWorking ? 'Pomodoro Complete! Time for a break.' : 'Break time is over! Back to work!');
        }, 100);
        isWorking = !isWorking;
        timeLeft = isWorking ? workTime : breakTime;
        updateTimerDisplay();
        timer = null;
      }
    }, 1000);
  }
});

// Reset the timer
resetBtn.addEventListener('click', () => {
  clearInterval(timer);
  timer = null;
  timeLeft = workTime;
  isWorking = true;
  updateTimerDisplay();
});

// Switch to break mode manually
breakBtn.addEventListener('click', () => {
  clearInterval(timer);
  timer = null;
  timeLeft = breakTime;
  isWorking = false;
  updateTimerDisplay();
});

// Show the customization options when "Customize Timer" is clicked
customizeBtn.addEventListener('click', () => {
  customTimerContainer.style.display = 'block';  // Show the custom duration inputs
});

// Save custom work and break times
saveCustomBtn.addEventListener('click', () => {
  const customWorkTime = parseInt(customWorkTimeInput.value);
  const customBreakTime = parseInt(customBreakTimeInput.value);

  if (!isNaN(customWorkTime) && customWorkTime > 0) {
    workTime = customWorkTime * 60;  // Convert minutes to seconds
  }

  if (!isNaN(customBreakTime) && customBreakTime > 0) {
    breakTime = customBreakTime * 60;  // Convert minutes to seconds
  }

  // Reset the timer display and hide the customization inputs
  timeLeft = isWorking ? workTime : breakTime;
  updateTimerDisplay();
  customTimerContainer.style.display = 'none';  // Hide the custom input fields
});

// Open Settings window
settingsBtn.addEventListener('click', () => {
  ipcRenderer.send('open-settings');  // Send an IPC message to open the settings window
});

updateTimerDisplay();
