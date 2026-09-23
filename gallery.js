/**
 * PHOTO MEMORIES GALLERY & CUSTOMIZER
 * Features:
 * - Category filtering (College, Couple, Engagement, Pre-wedding, Family, Wedding)
 * - Fullscreen Lightbox preview
 * - Custom photo manager: upload or paste image URL with LocalStorage persistence.
 */

(function () {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxMedia = document.getElementById('lightbox-media');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  const photoManagerModal = document.getElementById('photo-manager-modal');
  const photoModalClose = document.getElementById('photo-modal-close');
  const photoModalTargetTitle = document.getElementById('photo-modal-target-title');
  const photoFileInput = document.getElementById('photo-file-input');
  const photoUrlInput = document.getElementById('photo-url-input');
  const uploadDropzone = document.getElementById('upload-dropzone');
  const savePhotoBtn = document.getElementById('save-photo-btn');
  const resetToPlaceholderBtn = document.getElementById('reset-to-placeholder-btn');
  const openPhotoManagerBtn = document.getElementById('open-photo-manager-btn');

  let activeTargetPhotoId = null;

  // 1. Filter Tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // 2. Load Persisted Photos from LocalStorage
  function loadPersistedPhotos() {
    const saved = localStorage.getItem('prajwal_sharun_wedding_photos');
    if (!saved) return;
    try {
      const photos = JSON.parse(saved);
      galleryCards.forEach(card => {
        const id = card.getAttribute('data-id');
        if (photos[id]) {
          applyPhotoToCard(card, photos[id]);
        }
      });
    } catch (e) {
      console.error("Error loading photos:", e);
    }
  }

  function applyPhotoToCard(card, dataUrl) {
    const placeholderArt = card.querySelector('.placeholder-art');
    const realPhoto = card.querySelector('.real-photo');
    if (realPhoto && placeholderArt) {
      realPhoto.src = dataUrl;
      realPhoto.style.display = 'block';
      placeholderArt.style.display = 'none';
    }
  }

  function resetPhotoCard(card) {
    const placeholderArt = card.querySelector('.placeholder-art');
    const realPhoto = card.querySelector('.real-photo');
    if (realPhoto && placeholderArt) {
      realPhoto.src = '';
      realPhoto.style.display = 'none';
      placeholderArt.style.display = 'flex';
    }
  }

  // 3. Lightbox Preview
  galleryCards.forEach(card => {
    const frame = card.querySelector('.photo-frame');
    frame.addEventListener('click', () => {
      const realPhoto = card.querySelector('.real-photo');
      const captionText = card.querySelector('.photo-caption')?.textContent || 'Wedding Memory';

      if (realPhoto && realPhoto.style.display !== 'none' && realPhoto.src) {
        lightboxMedia.innerHTML = `<img src="${realPhoto.src}" alt="${captionText}">`;
      } else {
        const artTitle = card.querySelector('.art-title')?.textContent || 'Memory';
        const artSub = card.querySelector('.art-sub')?.textContent || '';
        lightboxMedia.innerHTML = `
          <div style="background: #FDFBF7; padding: 4rem 2rem; border-radius: 12px; border: 1px solid #D4AF37; color: #2B231D;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">✨</div>
            <h3 style="font-family: 'Cinzel', serif; font-size: 1.8rem; margin-bottom: 0.5rem;">${artTitle}</h3>
            <p style="font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; color: #6E6359;">${artSub}</p>
            <p style="font-size: 0.85rem; margin-top: 1.5rem; color: #AA8221;">Click 'Customize / Add Real Photos' to upload actual photos.</p>
          </div>
        `;
      }

      lightboxCaption.textContent = captionText;
      lightboxModal.classList.add('active');
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  });

  // 4. Trigger Photo Replace Modal
  window.triggerPhotoReplace = function (photoId, photoTitle) {
    activeTargetPhotoId = photoId;
    if (photoModalTargetTitle) {
      photoModalTargetTitle.textContent = `Update "${photoTitle}"`;
    }
    if (photoUrlInput) photoUrlInput.value = '';
    if (photoFileInput) photoFileInput.value = '';
    photoManagerModal.classList.add('active');
  };

  if (openPhotoManagerBtn) {
    openPhotoManagerBtn.addEventListener('click', () => {
      window.triggerPhotoReplace('photo-2', 'Prajwal & Sharun Couple Photo');
    });
  }

  if (photoModalClose) {
    photoModalClose.addEventListener('click', () => {
      photoManagerModal.classList.remove('active');
    });
  }

  // Upload Dropzone Click
  if (uploadDropzone && photoFileInput) {
    uploadDropzone.addEventListener('click', () => {
      photoFileInput.click();
    });

    uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropzone.style.borderColor = '#C59B27';
    });

    uploadDropzone.addEventListener('dragleave', () => {
      uploadDropzone.style.borderColor = '#D4AF37';
    });

    uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropzone.style.borderColor = '#D4AF37';
      if (e.dataTransfer.files.length) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });

    photoFileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        handleFileSelection(e.target.files[0]);
      }
    });
  }

  let tempImageData = null;

  function handleFileSelection(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      tempImageData = ev.target.result;
      if (uploadDropzone) {
        uploadDropzone.innerHTML = `<span style="font-size:1.8rem">✅</span><p>Image selected: <strong>${file.name}</strong></p>`;
      }
    };
    reader.readAsDataURL(file);
  }

  if (savePhotoBtn) {
    savePhotoBtn.addEventListener('click', () => {
      const urlValue = photoUrlInput ? photoUrlInput.value.trim() : '';
      const finalImage = urlValue || tempImageData;

      if (!finalImage) {
        alert('Please choose a photo file or enter an image URL.');
        return;
      }

      if (!activeTargetPhotoId) activeTargetPhotoId = 'photo-1';

      // Save to LocalStorage
      let saved = {};
      try {
        saved = JSON.parse(localStorage.getItem('prajwal_sharun_wedding_photos') || '{}');
      } catch (e) {}
      saved[activeTargetPhotoId] = finalImage;
      localStorage.setItem('prajwal_sharun_wedding_photos', JSON.stringify(saved));

      // Update card
      const targetCard = document.querySelector(`.gallery-card[data-id="${activeTargetPhotoId}"]`);
      if (targetCard) {
        applyPhotoToCard(targetCard, finalImage);
      }

      photoManagerModal.classList.remove('active');
      tempImageData = null;
    });
  }

  if (resetToPlaceholderBtn) {
    resetToPlaceholderBtn.addEventListener('click', () => {
      if (!activeTargetPhotoId) return;

      let saved = {};
      try {
        saved = JSON.parse(localStorage.getItem('prajwal_sharun_wedding_photos') || '{}');
      } catch (e) {}
      delete saved[activeTargetPhotoId];
      localStorage.setItem('prajwal_sharun_wedding_photos', JSON.stringify(saved));

      const targetCard = document.querySelector(`.gallery-card[data-id="${activeTargetPhotoId}"]`);
      if (targetCard) {
        resetPhotoCard(targetCard);
      }

      photoManagerModal.classList.remove('active');
    });
  }

  loadPersistedPhotos();
})();
