/**
 * RUNNING PERPETUAL MECHANICAL LOVE ENGINE
 * Chapter 03: "The Perpetual Engine of Love"
 * Features:
 * - Continuous synchronized running gear train with 16-tooth precision meshing
 * - Mechanical linkage crank-slider rods driving a pulsing Heart Engine
 * - Interactive RPM Speed Switcher (60 BPM Romance / 120 BPM Heartbeat / 240 BPM Overdrive)
 * - Click, drag, and scroll interactive transmission with dynamic mechanical sparks
 */

(function () {
  const prajwalGear = document.getElementById('prajwal-gear');
  const sharunGear = document.getElementById('sharun-gear');
  const topPinion = document.getElementById('top-pinion');
  const engineHeart = document.getElementById('engine-heart');
  const rodLeft = document.getElementById('rod-left');
  const rodRight = document.getElementById('rod-right');
  const gearsStage = document.getElementById('gears-stage');
  const rpmDisplay = document.getElementById('engine-rpm-val');
  const meshPoint = document.getElementById('mesh-point');

  if (!prajwalGear || !sharunGear) return;

  let currentAngle = 0;
  let baseSpeed = 1.2; // Default continuous running speed
  let targetSpeed = 1.2;
  let targetBPM = 120;
  let isDragging = false;
  let startX = 0;
  let sparkTimer = 0;

  // 1. Interactive Mode Buttons
  const btnSlow = document.getElementById('btn-mode-slow');
  const btnSync = document.getElementById('btn-mode-sync');
  const btnFast = document.getElementById('btn-mode-fast');
  const modeButtons = [btnSlow, btnSync, btnFast];

  function setEngineMode(speed, bpm, activeBtn) {
    targetSpeed = speed;
    targetBPM = bpm;
    modeButtons.forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    if (activeBtn) activeBtn.classList.add('active');
    if (rpmDisplay) {
      rpmDisplay.innerHTML = `${bpm} <small>BPM</small>`;
    }
  }

  if (btnSlow) {
    btnSlow.addEventListener('click', () => setEngineMode(0.6, 60, btnSlow));
  }
  if (btnSync) {
    btnSync.addEventListener('click', () => setEngineMode(1.2, 120, btnSync));
  }
  if (btnFast) {
    btnFast.addEventListener('click', () => setEngineMode(2.4, 240, btnFast));
  }

  // 2. Scroll acceleration
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const delta = Math.abs(scrollY - lastScrollY);
    currentAngle += delta * 0.12;
    lastScrollY = scrollY;
  }, { passive: true });

  // 3. Interactive Drag / Crank Transmission
  if (gearsStage) {
    gearsStage.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      currentAngle += deltaX * 0.6;
      startX = e.clientX;
      triggerSpark();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Support
    gearsStage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - startX;
      currentAngle += deltaX * 0.6;
      startX = e.touches[0].clientX;
      triggerSpark();
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  function triggerSpark() {
    if (meshPoint) {
      meshPoint.classList.add('sparking');
      setTimeout(() => {
        meshPoint.classList.remove('sparking');
      }, 300);
    }
  }

  // 4. Perpetual Engine Animation Loop
  function runMechanicalEngine() {
    // Smooth speed interpolation
    baseSpeed += (targetSpeed - baseSpeed) * 0.05;

    // Continuous perpetual rotation
    currentAngle += baseSpeed;

    const rad = (currentAngle * Math.PI) / 180;

    // Rotate Meshing Gears (Driver CW, Driven CCW)
    prajwalGear.style.transform = `rotate(${currentAngle}deg)`;
    sharunGear.style.transform = `rotate(${-currentAngle}deg)`;

    // Rotate Top Pinion at accelerated ratio
    if (topPinion) {
      topPinion.style.transform = `rotate(${currentAngle * 2.2}deg)`;
    }

    // Crankshaft Linkage Rods Kinematics
    const rodAngle = Math.sin(rad * 2) * 14;
    const rodStroke = Math.cos(rad * 2) * 8;

    if (rodLeft) {
      rodLeft.style.transform = `rotate(${-rodAngle}deg) translateY(${rodStroke}px)`;
    }
    if (rodRight) {
      rodRight.style.transform = `rotate(${rodAngle}deg) translateY(${rodStroke}px)`;
    }

    // Pulsing Mechanical Heart Engine
    if (engineHeart) {
      const heartScale = 1.0 + Math.abs(Math.sin(rad * 2)) * 0.22;
      engineHeart.style.transform = `scale(${heartScale})`;
    }

    // Periodic mesh contact sparks
    sparkTimer++;
    if (sparkTimer % 45 === 0) {
      triggerSpark();
    }

    requestAnimationFrame(runMechanicalEngine);
  }

  runMechanicalEngine();
})();
