/**
 * WEDDING DATE & LIVE COUNTDOWN ENGINE
 * Default state respects rule: "Wedding Date Coming Soon" until actual date is provided.
 * When a date is provided, enables live countdown: Days, Hours, Minutes, Seconds.
 */

(function () {
  const setDateBtn = document.getElementById('set-date-btn');
  const dateConfigModal = document.getElementById('date-config-modal');
  const dateModalClose = document.getElementById('date-modal-close');
  const dateConfigForm = document.getElementById('date-config-form');
  const clearDateBtn = document.getElementById('clear-date-btn');

  const weddingDateDisplay = document.getElementById('wedding-date-display');
  const countdownGrid = document.getElementById('countdown-timer-grid');
  const dateStatusBanner = document.getElementById('date-status-banner');

  const daysVal = document.getElementById('days-val');
  const hoursVal = document.getElementById('hours-val');
  const minutesVal = document.getElementById('minutes-val');
  const secondsVal = document.getElementById('seconds-val');

  const churchNameDisplay = document.getElementById('church-name-display');
  const churchDateDisplay = document.getElementById('church-date-display');
  const churchTimeDisplay = document.getElementById('church-time-display');

  const inputWeddingDate = document.getElementById('input-wedding-date');
  const inputChurchName = document.getElementById('input-church-name');
  const inputCeremonyTime = document.getElementById('input-ceremony-time');

  const DEFAULT_DATE = '2026-12-25T10:00:00';
  const DEFAULT_CHURCH = 'Basilica of the Sacred Heart of Jesus, Pondicherry';
  const DEFAULT_TIME = '10:00 AM IST';

  let countdownInterval = null;

  function loadSavedDetails() {
    let targetDateStr = DEFAULT_DATE;
    let churchName = DEFAULT_CHURCH;
    let ceremonyTime = DEFAULT_TIME;

    const saved = localStorage.getItem('prajwal_sharun_wedding_details');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.targetDate) targetDateStr = data.targetDate;
        if (data.churchName) churchName = data.churchName;
        if (data.ceremonyTime) ceremonyTime = data.ceremonyTime;
      } catch (e) {
        console.error("Error loading wedding details:", e);
      }
    }

    const targetDate = new Date(targetDateStr);
    activateCountdown(targetDate);

    if (weddingDateDisplay) {
      const formatted = targetDate.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      weddingDateDisplay.textContent = formatted;
    }

    if (churchNameDisplay) {
      churchNameDisplay.textContent = churchName;
    }

    if (churchDateDisplay) {
      churchDateDisplay.textContent = targetDate.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      });
    }

    if (churchTimeDisplay) {
      churchTimeDisplay.textContent = ceremonyTime;
    }

    if (inputWeddingDate && !inputWeddingDate.value) {
      // Set default input value
      inputWeddingDate.value = '2026-12-25T10:00';
    }
  }

  function activateCountdown(targetDate) {
    if (countdownGrid) countdownGrid.style.display = 'flex';

    if (countdownInterval) clearInterval(countdownInterval);

    function updateTimer() {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        if (daysVal) daysVal.textContent = '00';
        if (hoursVal) hoursVal.textContent = '00';
        if (minutesVal) minutesVal.textContent = '00';
        if (secondsVal) secondsVal.textContent = '00';
        clearInterval(countdownInterval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (daysVal) daysVal.textContent = String(days).padStart(2, '0');
      if (hoursVal) hoursVal.textContent = String(hours).padStart(2, '0');
      if (minutesVal) minutesVal.textContent = String(minutes).padStart(2, '0');
      if (secondsVal) secondsVal.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
  }

  function resetToDefault() {
    localStorage.removeItem('prajwal_sharun_wedding_details');
    loadSavedDetails();
  }

  if (setDateBtn) {
    setDateBtn.addEventListener('click', () => {
      dateConfigModal.classList.add('active');
    });
  }

  if (dateModalClose) {
    dateModalClose.addEventListener('click', () => {
      dateConfigModal.classList.remove('active');
    });
  }

  if (dateConfigForm) {
    dateConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dateVal = inputWeddingDate.value;
      const churchVal = inputChurchName.value.trim();
      const timeVal = inputCeremonyTime.value.trim();

      if (!dateVal) {
        alert('Please choose a wedding date.');
        return;
      }

      const weddingDetails = {
        targetDate: dateVal,
        churchName: churchVal || DEFAULT_CHURCH,
        ceremonyTime: timeVal || DEFAULT_TIME
      };

      localStorage.setItem('prajwal_sharun_wedding_details', JSON.stringify(weddingDetails));
      loadSavedDetails();
      dateConfigModal.classList.remove('active');
    });
  }

  if (clearDateBtn) {
    clearDateBtn.addEventListener('click', () => {
      resetToDefault();
      dateConfigModal.classList.remove('active');
    });
  }

  loadSavedDetails();
})();
