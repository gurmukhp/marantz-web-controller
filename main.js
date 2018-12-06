const statusButton = document.getElementById('status');
const toggleButton = document.getElementById('toggle');
const enableButton = document.getElementById('enable');
const disableButton = document.getElementById('disable');

let nightModeEnabled;

fetch('/status').then((response) => {
  response.json().then((status) => {
    nightModeEnabled = status.enabled;
    toggleButton.innerText = ((nightModeEnabled) ? 'Disable' : 'Enable') + ' Night Mode';
  });
});

toggleButton.addEventListener('click', () => {
  if (nightModeEnabled !== undefined) {
    if (nightModeEnabled) {
      fetch('/disableNightMode');
    } else {
      fetch('/enableNightMode');
    }
    nightModeEnabled = !nightModeEnabled;
    toggleButton.innerText = ((nightModeEnabled) ? 'Disable' : 'Enable') + ' Night Mode';
  }
});

// enableButton.addEventListener('click', () => {
//   fetch('/enableNightMode');
// });

// disableButton.addEventListener('click', () => {
//   fetch('/disableNightMode');
// });
