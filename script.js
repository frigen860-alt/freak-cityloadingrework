const audio = document.getElementById('music');
const playBtn = document.getElementById('playBtn');
const muteBtn = document.getElementById('muteBtn');
const volume = document.getElementById('volume');
const seek = document.getElementById('seek');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const downloadFile = document.getElementById('downloadFile');
const statusText = document.getElementById('statusText');
const serverName = document.getElementById('serverName');

let filesTotal = 0;
let filesNeeded = 0;

audio.volume = Number(volume.value);

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updatePlayButton() {
  playBtn.textContent = audio.paused ? '▶' : '❚❚';
  playBtn.setAttribute('aria-label', audio.paused ? 'Воспроизвести музыку' : 'Поставить музыку на паузу');
}

playBtn.addEventListener('click', async () => {
  try {
    if (audio.paused) await audio.play();
    else audio.pause();
  } catch (error) {
    console.warn('Не удалось запустить музыку:', error);
  }
  updatePlayButton();
});

audio.addEventListener('play', updatePlayButton);
audio.addEventListener('pause', updatePlayButton);
audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});
audio.addEventListener('timeupdate', () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  if (audio.duration) seek.value = String((audio.currentTime / audio.duration) * 100);
});

seek.addEventListener('input', () => {
  if (audio.duration) audio.currentTime = (Number(seek.value) / 100) * audio.duration;
});

volume.addEventListener('input', () => {
  audio.volume = Number(volume.value);
  audio.muted = false;
  muteBtn.textContent = audio.volume === 0 ? '🔇' : '🔊';
});

muteBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? '🔇' : '🔊';
});

function setProgress(percent) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  progressBar.style.width = `${value}%`;
  progressText.textContent = `${value}%`;
}

// Функции, которые вызывает загрузочный экран Garry's Mod.
window.GameDetails = function (server, serverUrl, mapName, maxPlayers, steamId, gameMode) {
  serverName.textContent = server || 'Freak-City';
  statusText.textContent = `Карта: ${mapName || 'неизвестно'} • Режим: ${gameMode || 'Garry\'s Mod'}`;
};

window.SetFilesTotal = function (total) {
  filesTotal = Math.max(0, Number(total) || 0);
  if (filesTotal > 0) {
    setProgress(((filesTotal - filesNeeded) / filesTotal) * 100);
  }
};

window.SetFilesNeeded = function (needed) {
  filesNeeded = Math.max(0, Number(needed) || 0);
  if (filesTotal > 0) {
    setProgress(((filesTotal - filesNeeded) / filesTotal) * 100);
  }
};

window.DownloadingFile = function (fileName) {
  downloadFile.textContent = fileName || 'Загрузка файла...';
};

window.SetStatusChanged = function (status) {
  statusText.textContent = status || 'Подключение к серверу...';
  const lower = String(status || '').toLowerCase();
  if (lower.includes('sending client info') || lower.includes('получение данных')) {
    setProgress(100);
  }
};

// Браузеры часто блокируют автозапуск со звуком.
// Пробуем запустить, но кнопка воспроизведения всегда остаётся доступной.
audio.play().catch(() => updatePlayButton());
