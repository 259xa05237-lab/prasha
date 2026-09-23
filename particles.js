/**
 * ULTRA-PREMIUM 3D BUTTERFLY & LUMINOUS WHITE STARDUST TRAIL ENGINE
 * Features:
 * - Larger, majestic realistic 3D butterflies falling & fluttering gracefully from top to bottom
 * - Smooth 3D wing flapping with perspective depth, banking tilt, and anatomical wing veins
 * - Continuous glowing pure white stardust trail & fairy light ribbon flowing behind each butterfly
 * - 6 Curated Vibrant Color Themes (Golden Monarch, Sapphire Azure, Ruby Magenta, Emerald Glow, Amethyst Violet, Sunset Coral)
 * - Interactive scattering and extra wing flutter on cursor & touch movement
 */

(function () {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let butterflies = [];
  let whiteTrails = [];
  let ambientSparkles = [];
  let mouseSparks = [];
  const butterflyCount = 30; // High-quality, larger realistic butterflies
  const ambientSparkleCount = 35;

  let mouse = { x: -1000, y: -1000, active: false };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;

    if (Math.random() > 0.35) {
      mouseSparks.push(new MouseSpark(mouse.x, mouse.y));
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
      if (Math.random() > 0.4) {
        mouseSparks.push(new MouseSpark(mouse.x, mouse.y));
      }
    }
  }, { passive: true });

  resize();

  // Vibrant, rich color themes for realistic butterflies
  const BUTTERFLY_THEMES = [
    {
      name: 'Imperial Gold Monarch',
      topWingMain: '#FFD700',
      topWingEdge: '#E67E22',
      botWingMain: '#F39C12',
      botWingEdge: '#B7950B',
      veinColor: 'rgba(92, 53, 0, 0.45)',
      edgeBorder: '#3E2723',
      spots: '#FFFFFF',
      body: '#2E1C0C',
      glow: 'rgba(255, 215, 0, 0.6)'
    },
    {
      name: 'Royal Sapphire Azure',
      topWingMain: '#38BDF8',
      topWingEdge: '#1D4ED8',
      botWingMain: '#60A5FA',
      botWingEdge: '#1E40AF',
      veinColor: 'rgba(15, 23, 42, 0.4)',
      edgeBorder: '#0F172A',
      spots: '#FFFFFF',
      body: '#0F172A',
      glow: 'rgba(56, 189, 248, 0.65)'
    },
    {
      name: 'Velvet Rose Magenta',
      topWingMain: '#F472B6',
      topWingEdge: '#BE185D',
      botWingMain: '#FB7185',
      botWingEdge: '#9F1239',
      veinColor: 'rgba(76, 5, 25, 0.4)',
      edgeBorder: '#4C0519',
      spots: '#FFF1F2',
      body: '#3A0210',
      glow: 'rgba(244, 114, 182, 0.65)'
    },
    {
      name: 'Emerald Jade Aurora',
      topWingMain: '#34D399',
      topWingEdge: '#047857',
      botWingMain: '#6EE7B7',
      botWingEdge: '#065F46',
      veinColor: 'rgba(6, 78, 59, 0.4)',
      edgeBorder: '#022C22',
      spots: '#FFFFFF',
      body: '#022C22',
      glow: 'rgba(52, 211, 153, 0.65)'
    },
    {
      name: 'Electric Amethyst Violet',
      topWingMain: '#C084FC',
      topWingEdge: '#6B21A8',
      botWingMain: '#E879F9',
      botWingEdge: '#7E22CE',
      veinColor: 'rgba(59, 7, 100, 0.4)',
      edgeBorder: '#2E1065',
      spots: '#FAF5FF',
      body: '#1E1B4B',
      glow: 'rgba(192, 132, 252, 0.65)'
    },
    {
      name: 'Sunset Amber Coral',
      topWingMain: '#FDBA74',
      topWingEdge: '#C2410C',
      botWingMain: '#FCA5A5',
      botWingEdge: '#9A3412',
      veinColor: 'rgba(67, 20, 7, 0.4)',
      edgeBorder: '#431407',
      spots: '#FFFFFF',
      body: '#271005',
      glow: 'rgba(251, 146, 60, 0.65)'
    }
  ];

  /**
   * Continuous Pure White Stardust Particle following behind butterfly
   */
  class WhiteTrailParticle {
    constructor(x, y, speedY, speedX) {
      this.x = x + (Math.random() - 0.5) * 6;
      this.y = y + (Math.random() - 0.5) * 6;
      this.size = Math.random() * 2.8 + 1.2;
      this.alpha = Math.random() * 0.35 + 0.65;
      this.decay = Math.random() * 0.022 + 0.016;
      this.vx = (Math.random() - 0.5) * 0.6 + (speedX || 0) * 0.15;
      this.vy = -Math.random() * 0.4 - 0.1; // Gentle lingering float
      this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      this.pulse += 0.08;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = Math.max(0, this.alpha);

      // Luminous white stardust with soft white glow
      const r = this.size * (0.8 + Math.sin(this.pulse) * 0.2);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.5);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(0.8, 'rgba(240, 245, 255, 0.3)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Tiny crisp center diamond
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  /**
   * Realistic 3D Fluttering Butterfly
   */
  class Realistic3DButterfly {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      // Start slightly above the top
      this.y = initial ? Math.random() * height : -Math.random() * 80 - 40;
      
      // Increased size for stunning visual prominence
      this.size = Math.random() * 14 + 22; // 22px to 36px (wingspan ~50-80px!)
      this.speedY = Math.random() * 0.9 + 0.65; // Relaxing downward descent
      
      this.swaySpeed = Math.random() * 0.025 + 0.015;
      this.swayAmplitude = Math.random() * 2.4 + 1.2;
      this.swayPhase = Math.random() * Math.PI * 2;
      
      this.angle = (Math.random() - 0.5) * 0.3;
      this.angleSpeed = (Math.random() - 0.5) * 0.008;
      
      // 3D Flap Physics
      this.wingPhase = Math.random() * Math.PI * 2;
      this.flapSpeed = Math.random() * 0.15 + 0.12;
      
      this.opacity = Math.random() * 0.25 + 0.75;
      this.theme = BUTTERFLY_THEMES[Math.floor(Math.random() * BUTTERFLY_THEMES.length)];
      
      // History of past positions for continuous white ribbon trail
      this.trailHistory = [];
      this.maxTrailHistory = 10;
    }

    update() {
      this.y += this.speedY;
      this.swayPhase += this.swaySpeed;
      const swayDX = Math.sin(this.swayPhase) * this.swayAmplitude;
      this.x += swayDX;
      this.angle += this.angleSpeed;
      this.wingPhase += this.flapSpeed;

      // Add to past trail history
      this.trailHistory.unshift({ x: this.x, y: this.y });
      if (this.trailHistory.length > this.maxTrailHistory) {
        this.trailHistory.pop();
      }

      // Continuously emit white stardust behind movement
      const emitRate = 2;
      for (let i = 0; i < emitRate; i++) {
        // Emit from back side / wingtips
        const offsetBack = 10;
        whiteTrails.push(new WhiteTrailParticle(
          this.x + (Math.random() - 0.5) * 8,
          this.y - offsetBack + (Math.random() - 0.5) * 6,
          this.speedY,
          swayDX
        ));
      }

      // Interactive mouse repulsion
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x += (dx / dist) * force * 3.5;
          this.y += (dy / dist) * force * 2.5;
          this.flapSpeed = 0.32; // Rapid excited flutter
          
          // Extra bursts of white stardust when disturbed
          whiteTrails.push(new WhiteTrailParticle(this.x, this.y, this.speedY, swayDX));
        } else {
          this.flapSpeed = Math.max(0.12, this.flapSpeed - 0.005);
        }
      }

      // Loop when past bottom
      if (this.y > height + 60 || this.x < -60 || this.x > width + 60) {
        this.reset();
      }
    }

    draw() {
      // 1. Draw glowing white ribbon connector line trailing behind
      if (this.trailHistory.length > 2) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.trailHistory[0].x, this.trailHistory[0].y);
        for (let i = 1; i < this.trailHistory.length; i++) {
          ctx.lineTo(this.trailHistory[i].x, this.trailHistory[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw 3D Anatomical Butterfly
      ctx.save();
      ctx.translate(this.x, this.y);
      
      // Dynamic bank angle following sway
      const bankAngle = this.angle + Math.sin(this.swayPhase) * 0.25;
      ctx.rotate(bankAngle);
      ctx.globalAlpha = this.opacity;

      const t = this.theme;
      const s = this.size;
      const wingScale = Math.cos(this.wingPhase); // 3D Flap transformation factor

      ctx.shadowColor = t.glow;
      ctx.shadowBlur = 10;

      // --- LEFT WING (Flapping in 3D) ---
      ctx.save();
      ctx.scale(wingScale, 1);

      // Forewing Left
      ctx.beginPath();
      ctx.moveTo(-1, -s * 0.1);
      ctx.bezierCurveTo(-s * 0.8, -s * 1.3, -s * 1.7, -s * 0.8, -s * 1.5, s * 0.15);
      ctx.bezierCurveTo(-s * 1.3, s * 0.6, -s * 0.5, s * 0.5, -1, s * 0.2);
      
      const gradForeL = ctx.createLinearGradient(-s * 1.7, -s * 1.3, 0, s * 0.2);
      gradForeL.addColorStop(0, t.topWingMain);
      gradForeL.addColorStop(0.6, t.topWingEdge);
      gradForeL.addColorStop(0.95, t.edgeBorder);
      gradForeL.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = gradForeL;
      ctx.fill();

      // Wing Veins Left Forewing
      ctx.strokeStyle = t.veinColor;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-1, 0);
      ctx.quadraticCurveTo(-s * 0.8, -s * 0.5, -s * 1.3, -s * 0.7);
      ctx.moveTo(-1, 0);
      ctx.quadraticCurveTo(-s * 0.9, -s * 0.1, -s * 1.4, s * 0.1);
      ctx.moveTo(-1, 0);
      ctx.quadraticCurveTo(-s * 0.7, s * 0.2, -s * 1.1, s * 0.45);
      ctx.stroke();

      // Delicate White Margin Dots
      ctx.fillStyle = t.spots;
      ctx.beginPath();
      ctx.arc(-s * 1.4, -s * 0.6, s * 0.08, 0, Math.PI * 2);
      ctx.arc(-s * 1.5, -s * 0.2, s * 0.07, 0, Math.PI * 2);
      ctx.arc(-s * 1.38, s * 0.2, s * 0.08, 0, Math.PI * 2);
      ctx.arc(-s * 1.0, -s * 1.0, s * 0.07, 0, Math.PI * 2);
      ctx.fill();

      // Hindwing Left
      ctx.beginPath();
      ctx.moveTo(-1, s * 0.15);
      ctx.bezierCurveTo(-s * 1.0, s * 0.3, -s * 1.3, s * 1.3, -s * 0.65, s * 1.45);
      ctx.bezierCurveTo(-s * 0.25, s * 1.45, -s * 0.1, s * 0.9, -1, s * 0.65);
      
      const gradHindL = ctx.createLinearGradient(-s * 1.3, s * 0.2, 0, s * 1.45);
      gradHindL.addColorStop(0, t.botWingMain);
      gradHindL.addColorStop(0.7, t.botWingEdge);
      gradHindL.addColorStop(1, t.edgeBorder);
      ctx.fillStyle = gradHindL;
      ctx.fill();

      // Hindwing Veins
      ctx.beginPath();
      ctx.moveTo(-1, s * 0.3);
      ctx.quadraticCurveTo(-s * 0.7, s * 0.7, -s * 0.9, s * 1.1);
      ctx.moveTo(-1, s * 0.3);
      ctx.quadraticCurveTo(-s * 0.4, s * 0.9, -s * 0.6, s * 1.3);
      ctx.stroke();

      // Hindwing Edge Spots
      ctx.fillStyle = t.spots;
      ctx.beginPath();
      ctx.arc(-s * 1.0, s * 0.9, s * 0.07, 0, Math.PI * 2);
      ctx.arc(-s * 0.65, s * 1.3, s * 0.08, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // --- RIGHT WING (Flapping in Counter 3D) ---
      ctx.save();
      ctx.scale(-wingScale, 1);

      // Forewing Right
      ctx.beginPath();
      ctx.moveTo(-1, -s * 0.1);
      ctx.bezierCurveTo(-s * 0.8, -s * 1.3, -s * 1.7, -s * 0.8, -s * 1.5, s * 0.15);
      ctx.bezierCurveTo(-s * 1.3, s * 0.6, -s * 0.5, s * 0.5, -1, s * 0.2);
      
      const gradForeR = ctx.createLinearGradient(-s * 1.7, -s * 1.3, 0, s * 0.2);
      gradForeR.addColorStop(0, t.topWingMain);
      gradForeR.addColorStop(0.6, t.topWingEdge);
      gradForeR.addColorStop(0.95, t.edgeBorder);
      gradForeR.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = gradForeR;
      ctx.fill();

      // Forewing Veins
      ctx.strokeStyle = t.veinColor;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-1, 0);
      ctx.quadraticCurveTo(-s * 0.8, -s * 0.5, -s * 1.3, -s * 0.7);
      ctx.moveTo(-1, 0);
      ctx.quadraticCurveTo(-s * 0.9, -s * 0.1, -s * 1.4, s * 0.1);
      ctx.moveTo(-1, 0);
      ctx.quadraticCurveTo(-s * 0.7, s * 0.2, -s * 1.1, s * 0.45);
      ctx.stroke();

      // White Margin Dots
      ctx.fillStyle = t.spots;
      ctx.beginPath();
      ctx.arc(-s * 1.4, -s * 0.6, s * 0.08, 0, Math.PI * 2);
      ctx.arc(-s * 1.5, -s * 0.2, s * 0.07, 0, Math.PI * 2);
      ctx.arc(-s * 1.38, s * 0.2, s * 0.08, 0, Math.PI * 2);
      ctx.arc(-s * 1.0, -s * 1.0, s * 0.07, 0, Math.PI * 2);
      ctx.fill();

      // Hindwing Right
      ctx.beginPath();
      ctx.moveTo(-1, s * 0.15);
      ctx.bezierCurveTo(-s * 1.0, s * 0.3, -s * 1.3, s * 1.3, -s * 0.65, s * 1.45);
      ctx.bezierCurveTo(-s * 0.25, s * 1.45, -s * 0.1, s * 0.9, -1, s * 0.65);
      
      const gradHindR = ctx.createLinearGradient(-s * 1.3, s * 0.2, 0, s * 1.45);
      gradHindR.addColorStop(0, t.botWingMain);
      gradHindR.addColorStop(0.7, t.botWingEdge);
      gradHindR.addColorStop(1, t.edgeBorder);
      ctx.fillStyle = gradHindR;
      ctx.fill();

      // Hindwing Veins
      ctx.beginPath();
      ctx.moveTo(-1, s * 0.3);
      ctx.quadraticCurveTo(-s * 0.7, s * 0.7, -s * 0.9, s * 1.1);
      ctx.moveTo(-1, s * 0.3);
      ctx.quadraticCurveTo(-s * 0.4, s * 0.9, -s * 0.6, s * 1.3);
      ctx.stroke();

      // Hindwing Edge Spots
      ctx.fillStyle = t.spots;
      ctx.beginPath();
      ctx.arc(-s * 1.0, s * 0.9, s * 0.07, 0, Math.PI * 2);
      ctx.arc(-s * 0.65, s * 1.3, s * 0.08, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // --- BUTTERFLY BODY, THORAX & ANTENNAE ---
      ctx.shadowBlur = 0;
      ctx.fillStyle = t.body;

      // Slender Abdomen
      ctx.beginPath();
      ctx.ellipse(0, s * 0.35, s * 0.1, s * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Thorax & Head
      ctx.beginPath();
      ctx.arc(0, -s * 0.08, s * 0.12, 0, Math.PI * 2);
      ctx.arc(0, -s * 0.24, s * 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Antennae with elegant curves
      ctx.strokeStyle = t.body;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.24);
      ctx.quadraticCurveTo(-s * 0.35, -s * 0.6, -s * 0.45, -s * 0.8);
      ctx.moveTo(0, -s * 0.24);
      ctx.quadraticCurveTo(s * 0.35, -s * 0.6, s * 0.45, -s * 0.8);
      ctx.stroke();

      // Glowing Pure White Antenna Tips
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(-s * 0.45, -s * 0.8, 1.5, 0, Math.PI * 2);
      ctx.arc(s * 0.45, -s * 0.8, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  /**
   * Ambient Floating Golden Stardust
   */
  class AmbientSparkle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.speedY = Math.random() * 0.25 + 0.05;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
    }

    update() {
      this.y += this.speedY;
      this.pulse += this.pulseSpeed;
      if (this.y > height + 10) {
        this.y = -10;
        this.x = Math.random() * width;
      }
    }

    draw() {
      const curOp = this.opacity * (0.6 + Math.sin(this.pulse) * 0.4);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = `rgba(247, 231, 180, ${curOp})`;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /**
   * Interactive Mouse Sparkle
   */
  class MouseSpark {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 16;
      this.y = y + (Math.random() - 0.5) * 16;
      this.size = Math.random() * 2.8 + 1.2;
      this.alpha = 1;
      this.decay = Math.random() * 0.03 + 0.02;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5 + 0.4;
      const colors = ['#FFFFFF', '#FDE68A', '#F472B6', '#38BDF8', '#34D399'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate butterflies and ambient sparkles
  for (let i = 0; i < butterflyCount; i++) {
    butterflies.push(new Realistic3DButterfly());
  }

  for (let i = 0; i < ambientSparkleCount; i++) {
    sparkles.push(new AmbientSparkle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw ambient sparkles
    for (let s of sparkles) {
      s.update();
      s.draw();
    }

    // 2. Draw trailing white stardust particles (underneath butterflies)
    for (let i = whiteTrails.length - 1; i >= 0; i--) {
      whiteTrails[i].update();
      whiteTrails[i].draw();
      if (whiteTrails[i].alpha <= 0) {
        whiteTrails.splice(i, 1);
      }
    }

    // 3. Draw realistic 3D butterflies with active white ribbon trails
    for (let b of butterflies) {
      b.update();
      b.draw();
    }

    // 4. Draw mouse bursts
    for (let i = mouseSparks.length - 1; i >= 0; i--) {
      mouseSparks[i].update();
      mouseSparks[i].draw();
      if (mouseSparks[i].alpha <= 0) {
        mouseSparks.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
