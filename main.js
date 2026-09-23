/**
 * MAIN CONTROLLER
 * Handles navigation scroll effects, chapter scrollspy tracker, mobile menu, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const chapterBadge = document.getElementById('chapter-badge');
  const chapterDots = document.querySelectorAll('.chapter-dots li');

  const openVenueModalBtn = document.getElementById('open-venue-modal-btn');
  const mapModal = document.getElementById('pondicherry-map-modal');
  const mapModalClose = document.getElementById('map-modal-close');

  // 1. Navbar Scrolled State
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Chapter ScrollSpy Tracker
  const sections = [
    { id: 'hero', name: 'Prologue' },
    { id: 'chapter-beginning', name: 'Chapter 01: The Beginning' },
    { id: 'chapter-conversations', name: 'Chapter 02: Conversations' },
    { id: 'chapter-connection', name: 'Chapter 03: Connection' },
    { id: 'chapter-journey', name: 'Chapter 04: The Journey' },
    { id: 'chapter-memories', name: 'Chapter 05: Memories' },
    { id: 'chapter-wedding', name: 'Chapter 06: The Wedding' },
    { id: 'chapter-forever', name: 'Chapter 07: Forever' }
  ];

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 250;

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (el && el.offsetTop <= scrollPosition) {
        if (chapterBadge) {
          chapterBadge.textContent = sections[i].name.split(':')[0];
        }

        chapterDots.forEach(dot => {
          if (dot.getAttribute('data-target') === sections[i].id) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
        break;
      }
    }
  }, { passive: true });

  // Chapter Dot Click to Smooth Scroll
  chapterDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetId = dot.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 4. Venue / Map Modal
  if (openVenueModalBtn && mapModal) {
    openVenueModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      mapModal.classList.add('active');
    });
  }

  if (mapModalClose && mapModal) {
    mapModalClose.addEventListener('click', () => {
      mapModal.classList.remove('active');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('active');
    }
  });
});
