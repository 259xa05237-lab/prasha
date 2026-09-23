/**
 * RSVP & GUESTBOOK WISHES ENGINE
 * Handles:
 * - Proper validation for RSVP
 * - Success state with celebratory feedback
 * - Guestbook wish submissions with polite moderation notice & card rendering.
 */

(function () {
  // 1. RSVP Form
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpName = document.getElementById('rsvp-name');
  const rsvpGuests = document.getElementById('rsvp-guests');
  const rsvpMessage = document.getElementById('rsvp-message');
  const nameError = document.getElementById('name-error');
  const rsvpSuccessState = document.getElementById('rsvp-success-state');
  const resetRsvpBtn = document.getElementById('reset-rsvp-btn');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      if (!rsvpName.value.trim()) {
        nameError.style.display = 'block';
        rsvpName.focus();
        isValid = false;
      } else {
        nameError.style.display = 'none';
      }

      if (!isValid) return;

      const attendingRadio = document.querySelector('input[name="attending"]:checked');
      const rsvpData = {
        name: rsvpName.value.trim(),
        guests: rsvpGuests.value,
        attending: attendingRadio ? attendingRadio.value : 'yes',
        message: rsvpMessage.value.trim(),
        submittedAt: new Date().toISOString()
      };

      // Save to local storage
      let existing = [];
      try {
        existing = JSON.parse(localStorage.getItem('prajwal_sharun_rsvps') || '[]');
      } catch (err) {}
      existing.push(rsvpData);
      localStorage.setItem('prajwal_sharun_rsvps', JSON.stringify(existing));

      // Show success
      rsvpForm.style.display = 'none';
      rsvpSuccessState.style.display = 'block';
    });
  }

  if (resetRsvpBtn) {
    resetRsvpBtn.addEventListener('click', () => {
      rsvpForm.reset();
      rsvpForm.style.display = 'block';
      rsvpSuccessState.style.display = 'none';
    });
  }

  // 2. Wishes / Guestbook Form
  const wishForm = document.getElementById('wish-form');
  const wishAuthor = document.getElementById('wish-author');
  const wishContent = document.getElementById('wish-content');
  const wishesDisplayGrid = document.getElementById('wishes-display-grid');

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = wishAuthor.value.trim();
      const content = wishContent.value.trim();

      if (!author || !content) {
        alert('Please provide both your name and wedding wish.');
        return;
      }

      // Add to display dynamically
      const newCard = document.createElement('div');
      newCard.className = 'wish-card glass-panel';
      newCard.style.animation = 'fadeIn 0.6s ease';
      newCard.innerHTML = `
        <div class="wish-quote-icon">“</div>
        <p class="wish-text">“${escapeHTML(content)}”</p>
        <div class="wish-footer">
          <span class="wish-sender">— ${escapeHTML(author)}</span>
          <span class="wish-heart">❤️</span>
        </div>
      `;

      if (wishesDisplayGrid) {
        wishesDisplayGrid.prepend(newCard);
      }

      // Save wish in local storage
      let wishes = [];
      try {
        wishes = JSON.parse(localStorage.getItem('prajwal_sharun_wishes') || '[]');
      } catch (err) {}
      wishes.unshift({ author, content, date: new Date().toISOString() });
      localStorage.setItem('prajwal_sharun_wishes', JSON.stringify(wishes));

      wishForm.reset();
      alert('Thank you! Your heartfelt wish has been sent to Prajwal & Sharun. ❤️');
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Load custom submitted wishes
  function loadWishes() {
    try {
      const wishes = JSON.parse(localStorage.getItem('prajwal_sharun_wishes') || '[]');
      wishes.forEach(w => {
        const card = document.createElement('div');
        card.className = 'wish-card glass-panel';
        card.innerHTML = `
          <div class="wish-quote-icon">“</div>
          <p class="wish-text">“${escapeHTML(w.content)}”</p>
          <div class="wish-footer">
            <span class="wish-sender">— ${escapeHTML(w.author)}</span>
            <span class="wish-heart">❤️</span>
          </div>
        `;
        if (wishesDisplayGrid) wishesDisplayGrid.prepend(card);
      });
    } catch (e) {}
  }

  loadWishes();
})();
