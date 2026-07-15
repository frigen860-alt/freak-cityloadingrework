(() => {
  "use strict";

  const progressFill = document.getElementById("progressFill");
  const progressBox = document.querySelector(".progress");
  const percentText = document.getElementById("percentText");
  const fileText = document.getElementById("fileText");
  const statusText = document.getElementById("statusText");
  const filesText = document.getElementById("filesText");

  let totalFiles = 0;
  let neededFiles = 0;
  let lastPercent = 0;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function setProgress(percent) {
    const safePercent = clamp(Number(percent) || 0, 0, 100);
    lastPercent = safePercent;
    progressFill.style.width = `${safePercent}%`;
    percentText.textContent = `${Math.round(safePercent)}%`;
    progressBox.setAttribute("aria-valuenow", String(Math.round(safePercent)));
  }

  function recalculateProgress() {
    if (totalFiles <= 0) {
      return;
    }

    const downloaded = clamp(totalFiles - neededFiles, 0, totalFiles);
    setProgress((downloaded / totalFiles) * 100);
    filesText.textContent = `Файлы: ${downloaded} из ${totalFiles}`;
  }

  // Functions called by the Garry's Mod loading screen.
  window.GameDetails = function(serverName, serverURL, mapName, maxPlayers, steamID, gameMode, volume, language) {
    statusText.textContent = `Подключение к ${serverName || "Freak-City"}...`;

    if (typeof volume !== "undefined") {
      const normalizedVolume = clamp(Number(volume) || 0.65, 0, 1);
      audio.volume = normalizedVolume;
      volumeSlider.value = String(normalizedVolume);
    }
  };

  window.SetFilesTotal = function(total) {
    totalFiles = Math.max(0, Number(total) || 0);
    neededFiles = totalFiles;
    recalculateProgress();
  };

  window.SetFilesNeeded = function(needed) {
    neededFiles = Math.max(0, Number(needed) || 0);
    recalculateProgress();
  };

  window.DownloadingFile = function(fileName) {
    fileText.textContent = fileName || "Получение файла...";
  };

  window.SetStatusChanged = function(status) {
    if (status) {
      statusText.textContent = status;
    }

    const normalized = String(status || "").toLowerCase();
    if (
      normalized.includes("sending client info") ||
      normalized.includes("client info") ||
      normalized.includes("подключ")
    ) {
      setProgress(Math.max(lastPercent, 99));
    }
  };

  // Music player.
  const audio = document.getElementById("audio");
  const playButton = document.getElementById("playButton");
  const muteButton = document.getElementById("muteButton");
  const volumeSlider = document.getElementById("volume");
  const seek = document.getElementById("seek");
  const currentTime = document.getElementById("currentTime");
  const duration = document.getElementById("duration");

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function updatePlayButton() {
    playButton.textContent = audio.paused ? "▶" : "❚❚";
  }

  playButton.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.warn("Не удалось запустить музыку автоматически:", error);
    }
    updatePlayButton();
  });

  muteButton.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteButton.textContent = audio.muted ? "🔇" : "🔊";
  });

  volumeSlider.addEventListener("input", () => {
    audio.volume = Number(volumeSlider.value);
    audio.muted = false;
    muteButton.textContent = "🔊";
  });

  seek.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = (Number(seek.value) / 100) * audio.duration;
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    currentTime.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      seek.value = String((audio.currentTime / audio.duration) * 100);
    }
  });

  audio.addEventListener("play", updatePlayButton);
  audio.addEventListener("pause", updatePlayButton);

  // Browser preview: add ?demo=1 to the page URL to see simulated progress.
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") === "1") {
    let demo = 0;
    totalFiles = 100;
    neededFiles = 100;
    statusText.textContent = "Демонстрация загрузочного экрана";
    const timer = setInterval(() => {
      demo += 1;
      neededFiles = 100 - demo;
      fileText.textContent = `addons/freakcity/content_${String(demo).padStart(3, "0")}.vpk`;
      recalculateProgress();
      if (demo >= 100) clearInterval(timer);
    }, 90);
  }
})();
