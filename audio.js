/**
 * AMBIENT WEDDING AUDIO ENGINE
 * Safe, elegant procedural acoustic chords using Web Audio API + Custom MP3 playback.
 * Does NOT autoplay loudly upon page load.
 */

(function () {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  const dropdown = document.getElementById('audio-dropdown');
  const playPauseBtn = document.getElementById('audio-play-pause-btn');
  const statusDot = document.getElementById('audio-status-dot');
  const volumeSlider = document.getElementById('audio-volume');
  const customAudioInput = document.getElementById('custom-audio-upload');

  if (!toggleBtn || !playPauseBtn) return;

  let isPlaying = false;
  let audioCtx = null;
  let gainNode = null;
  let synthInterval = null;
  let customAudio = null;

  // Romantic Pentatonic Chord progression (D major / B minor romantic frequencies)
  const notes = [
    293.66, // D4
    369.99, // F#4
    440.00, // A4
    587.33, // D5
    659.25, // E5
    739.99, // F#5
    880.00  // A5
  ];

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(parseFloat(volumeSlider.value) * 0.4, audioCtx.currentTime);
      gainNode.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, time, duration = 2.5) {
    if (!audioCtx || !isPlaying) return;

    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    // Soft warm bell/harp tone (combination of sine & triangle)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Warm envelope (soft attack, slow decay)
    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.linearRampToValueAtTime(0.18, time + 0.15);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(noteGain);
    noteGain.connect(gainNode);

    osc.start(time);
    osc.stop(time + duration);
  }

  function startSynthProgression() {
    initAudioContext();
    
    // Play warm arpeggiated romantic chords in peaceful intervals
    function triggerChord() {
      if (!isPlaying) return;
      const now = audioCtx.currentTime;
      // Random chord from palette
      const baseIdx = Math.floor(Math.random() * (notes.length - 3));
      playTone(notes[baseIdx], now, 3.5);
      playTone(notes[baseIdx + 1], now + 0.3, 3.2);
      playTone(notes[baseIdx + 2], now + 0.7, 3.0);
    }

    triggerChord();
    synthInterval = setInterval(triggerChord, 2800);
  }

  function stopSynthProgression() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  function togglePlayState() {
    if (customAudio && customAudio.src) {
      if (customAudio.paused) {
        customAudio.play();
        setPlayingUI(true);
      } else {
        customAudio.pause();
        setPlayingUI(false);
      }
      return;
    }

    if (!isPlaying) {
      isPlaying = true;
      startSynthProgression();
      setPlayingUI(true);
    } else {
      isPlaying = false;
      stopSynthProgression();
      setPlayingUI(false);
    }
  }

  function setPlayingUI(playing) {
    if (playing) {
      playPauseBtn.textContent = 'Pause Melody';
      statusDot.classList.add('playing');
    } else {
      playPauseBtn.textContent = 'Play Melody';
      statusDot.classList.remove('playing');
    }
  }

  // Toggle Dropdown
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== toggleBtn) {
      dropdown.classList.remove('active');
    }
  });

  playPauseBtn.addEventListener('click', () => {
    togglePlayState();
  });

  // Volume Change
  volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (gainNode && audioCtx) {
      gainNode.gain.setValueAtTime(val * 0.4, audioCtx.currentTime);
    }
    if (customAudio) {
      customAudio.volume = val;
    }
  });

  // Custom Audio File Upload
  if (customAudioInput) {
    customAudioInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        stopSynthProgression();
        if (customAudio) {
          customAudio.pause();
        }
        customAudio = new Audio(URL.createObjectURL(file));
        customAudio.volume = parseFloat(volumeSlider.value);
        customAudio.loop = true;
        customAudio.play().then(() => {
          isPlaying = true;
          setPlayingUI(true);
        }).catch(err => console.error("Audio playback error:", err));
      }
    });
  }
})();
