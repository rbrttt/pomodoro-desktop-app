let workTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60;  // 5 minutes in seconds
let timeLeft = workTime;
let timer;
let isWorking = true;

const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const breakBtn = document.getElementById('break-btn');

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
        alert(isWorking ? 'Pomodoro Complete! Time for a break.' : 'Break time is over! Back to work!');
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

updateTimerDisplay();
