export function restTimer() {
  const restTimerButton = document.getElementById("btn_timer");
  const timerLabel = document.getElementById("lbl_timer");
  if (!restTimerButton || !timerLabel) return;

  const STORAGE_ACTIVE = "fitness_timer_active";
  const STORAGE_RECENTS = "fitness_timer_recent_durations";
  const STORAGE_LAST = "fitness_timer_last_duration_sec";
  const DEFAULT_DURATION_SEC = 60;

  let intervalId = null;

  function safeJsonParse(val, fallback) {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }

  function clampInt(value, min, max) {
    const num = Number(value);
    if (Number.isNaN(num)) return min;
    return Math.min(max, Math.max(min, Math.trunc(num)));
  }

  function formatSeconds(totalSeconds) {
    const sec = Math.max(0, Math.trunc(totalSeconds));
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function loadRecents() {
    const raw = localStorage.getItem(STORAGE_RECENTS);
    const arr = safeJsonParse(raw, []);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v) && v > 0)
      .slice(0, 3);
  }

  function saveRecents(values) {
    localStorage.setItem(STORAGE_RECENTS, JSON.stringify(values.slice(0, 3)));
  }

  function pushRecent(durationSec) {
    const dur = Number(durationSec);
    if (!Number.isFinite(dur) || dur <= 0) return;
    const prev = loadRecents();
    const next = [dur, ...prev.filter((v) => v !== dur)].slice(0, 3);
    saveRecents(next);
  }

  function getLastDuration() {
    const raw = localStorage.getItem(STORAGE_LAST);
    const val = Number(raw);
    if (Number.isFinite(val) && val > 0) return Math.trunc(val);
    return DEFAULT_DURATION_SEC;
  }

  function setLastDuration(durationSec) {
    const dur = Number(durationSec);
    if (!Number.isFinite(dur) || dur <= 0) return;
    localStorage.setItem(STORAGE_LAST, String(Math.trunc(dur)));
  }

  function getActiveTimer() {
    const raw = localStorage.getItem(STORAGE_ACTIVE);
    if (!raw) return null;
    const obj = safeJsonParse(raw, null);
    if (!obj || typeof obj !== "object") return null;
    const startedAt = Number(obj.startedAt);
    const durationSec = Number(obj.durationSec);
    if (!Number.isFinite(startedAt) || !Number.isFinite(durationSec)) return null;
    if (startedAt <= 0 || durationSec <= 0) return null;
    return { startedAt, durationSec };
  }

  function setActiveTimer(startedAt, durationSec) {
    localStorage.setItem(
      STORAGE_ACTIVE,
      JSON.stringify({ startedAt, durationSec }),
    );
  }

  function clearActiveTimer() {
    localStorage.removeItem(STORAGE_ACTIVE);
  }

  function stopTick() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function showLabel() {
    timerLabel.classList.add("active");
  }

  function hideLabelSoon() {
    setTimeout(() => {
      timerLabel.classList.remove("active");
    }, 1000);
  }

  function renderFromActive() {
    const active = getActiveTimer();
    if (!active) {
      stopTick();
      return;
    }

    const now = Date.now();
    const elapsedMs = now - active.startedAt;
    const remainingMs = active.durationSec * 1000 - elapsedMs;
    const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

    showLabel();
    timerLabel.innerHTML = formatSeconds(remainingSec);

    if (remainingSec <= 0) {
      stopTick();
      clearActiveTimer();
      timerLabel.innerHTML = "Ende";
      hideLabelSoon();
    }
  }

  function startTimer(durationSec) {
    const dur = clampInt(durationSec, 1, 24 * 60 * 60);
    const startedAt = Date.now();
    setActiveTimer(startedAt, dur);
    setLastDuration(dur);
    pushRecent(dur);
    renderFromActive();
    stopTick();
    intervalId = setInterval(renderFromActive, 250);
  }

  function ensureTimerModal() {
    let modal = document.getElementById("modal_timer");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "modal_timer";
    modal.className = "mini-modal timer-modal";
    modal.innerHTML = `
      <div class="mini_modal_close_btn" aria-label="Schließen">X</div>
      <h2>Timer</h2>
      <div class="timer-modal__content">
        <div class="timer-modal__row">
          <label class="timer-modal__label" for="timer_minutes">Min</label>
          <input id="timer_minutes" class="timer-modal__input" type="number" min="0" max="999" value="0" />
          <label class="timer-modal__label" for="timer_seconds">Sek</label>
          <input id="timer_seconds" class="timer-modal__input" type="number" min="0" max="59" value="0" />
        </div>
        <div class="timer-modal__recents" id="timer_recents"></div>
        <button type="button" class="timer-modal__start" id="timer_start">Start</button>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  function openModal(modal) {
    modal.classList.add("active");
  }

  function closeModal(modal) {
    modal.classList.remove("active");
  }

  function renderRecents(modal) {
    const recentsWrap = modal.querySelector("#timer_recents");
    if (!recentsWrap) return;
    recentsWrap.innerHTML = "";
    const recents = loadRecents();
    recents.forEach((sec) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "timer-modal__recent";
      btn.textContent = formatSeconds(sec);
      btn.addEventListener("click", () => {
        startTimer(sec);
        closeModal(modal);
      });
      recentsWrap.appendChild(btn);
    });
  }

  function getDurationFromInputs(modal) {
    const minutesEl = modal.querySelector("#timer_minutes");
    const secondsEl = modal.querySelector("#timer_seconds");
    const minutes = clampInt(minutesEl?.value ?? 0, 0, 999);
    const seconds = clampInt(secondsEl?.value ?? 0, 0, 59);
    return minutes * 60 + seconds;
  }

  function setInputsFromDuration(modal, durationSec) {
    const minutesEl = modal.querySelector("#timer_minutes");
    const secondsEl = modal.querySelector("#timer_seconds");
    const dur = clampInt(durationSec, 1, 24 * 60 * 60);
    const minutes = Math.floor(dur / 60);
    const seconds = dur % 60;
    if (minutesEl) minutesEl.value = String(minutes);
    if (secondsEl) secondsEl.value = String(seconds);
  }

  // Open modal
  restTimerButton.addEventListener("click", () => {
    const modal = ensureTimerModal();
    setInputsFromDuration(modal, getLastDuration());
    renderRecents(modal);
    openModal(modal);
  });

  // Modal events (delegated after creation)
  const modal = ensureTimerModal();
  const closeBtn = modal.querySelector(".mini_modal_close_btn");
  closeBtn?.addEventListener("click", () => closeModal(modal));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal(modal);
  });

  const minutesEl = modal.querySelector("#timer_minutes");
  const secondsEl = modal.querySelector("#timer_seconds");
  minutesEl?.addEventListener("change", () => {
    const dur = getDurationFromInputs(modal);
    if (dur > 0) setLastDuration(dur);
  });
  secondsEl?.addEventListener("change", () => {
    const dur = getDurationFromInputs(modal);
    if (dur > 0) setLastDuration(dur);
  });

  const startBtn = modal.querySelector("#timer_start");
  startBtn?.addEventListener("click", () => {
    const dur = getDurationFromInputs(modal);
    if (dur <= 0) return;
    startTimer(dur);
    closeModal(modal);
  });

  // Resume running timer after reload
  const active = getActiveTimer();
  if (active) {
    renderFromActive();
    stopTick();
    intervalId = setInterval(renderFromActive, 250);
  }
}
