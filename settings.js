const { ipcRenderer } = require('electron');

const themeSelect = document.getElementById('theme-select');
const backgroundUpload = document.getElementById('background-upload');
const alarmSoundUpload = document.getElementById('alarm-sound-upload');
const alarmVolumeSlider = document.getElementById('alarm-volume');
const saveSettingsBtn = document.getElementById('save-settings-btn');

let selectedTheme = 'light';
let customBackgroundImage = null;
let customAlarmSound = null;
let alarmVolume = 0.5;  // Default volume

// Load settings when the settings window opens
ipcRenderer.on('load-settings', (event, settings) => {
  selectedTheme = settings.selectedTheme;
  alarmVolume = settings.alarmVolume;
  customBackgroundImage = settings.customBackgroundImage || null;
  customAlarmSound = settings.customAlarmSound || null;

  // Apply the settings to the UI elements
  themeSelect.value = selectedTheme;
  alarmVolumeSlider.value = alarmVolume;
  if (customBackgroundImage) {
    backgroundUpload.value = customBackgroundImage;
  }
  if (customAlarmSound) {
    alarmSoundUpload.value = customAlarmSound;
  }
});

// Handle theme selection
themeSelect.addEventListener('change', () => {
  selectedTheme = themeSelect.value;
});

// Handle background image upload
backgroundUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    customBackgroundImage = URL.createObjectURL(file);
  }
});

// Handle alarm sound upload
alarmSoundUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    customAlarmSound = URL.createObjectURL(file);
  }
});

// Handle alarm volume slider change
alarmVolumeSlider.addEventListener('input', () => {
  alarmVolume = parseFloat(alarmVolumeSlider.value);
});

// Save settings when the "Save Settings" button is clicked
saveSettingsBtn.addEventListener('click', () => {
  ipcRenderer.send('save-settings', {
    selectedTheme,
    customBackgroundImage,
    customAlarmSound,
    alarmVolume
  });
});
