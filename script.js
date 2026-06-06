/* ============================================
   PRASAD ENTERPRISES – SAFETY NETS
   Main JavaScript
   ============================================ */

'use strict';

// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      // Trigger hero animations after preloader
      document.querySelectorAll('.animate-fadeup').forEach(el => {
        el.style.animationPlayState = 'running';
      });
    }
  }, 1900);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollY = scrollY;
  updateActiveNavLink();
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger-btn');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ===== ACTIVE NAV LINK ON SCROLL =====
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = '#' + section.getAttribute('id');
    }
  });

  navLinkEls.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    }
  });
}

// ===== SCROLL ANIMATIONS (AOS-like) =====
function initScrollAnimations() {
  const animElements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  animElements.forEach(el => observer.observe(el));
}

// ===== ANIMATED COUNTERS =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current);
        }, 16);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ===== FLOATING PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 12 : 24;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 6 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 10 + 8;
    const opacity = Math.random() * 0.5 + 0.2;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      opacity: ${opacity};
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;

    container.appendChild(particle);
  }
}

// ===== REVIEWS SLIDER =====
function initReviews() {
  const track = document.getElementById('reviews-track');
  const prevBtn = document.getElementById('t-prev');
  const nextBtn = document.getElementById('t-next');
  const dotsContainer = document.getElementById('t-dots');

  if (!track) return;

  const cards = track.querySelectorAll('.review-card');
  const totalCards = cards.length;
  let currentIndex = 0;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('t-dot');
    dot.setAttribute('aria-label', `Review ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getVisibleCount() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function getCardWidth() {
    return cards[0].offsetWidth + 24;
  }

  function goTo(index) {
    const maxIndex = Math.max(0, totalCards - getVisibleCount());
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    track.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
    dotsContainer.querySelectorAll('.t-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  }, { passive: true });

  window.addEventListener('resize', () => goTo(currentIndex));
}

// ===== SERVICES SLIDER =====
function initServicesSlider() {
  const track = document.getElementById('services-track');
  const prevBtn = document.getElementById('services-prev');
  const nextBtn = document.getElementById('services-next');
  const dotsContainer = document.getElementById('services-dots');

  if (!track) return;

  const cards = track.querySelectorAll('.service-card');
  const total = cards.length;
  let currentIndex = 0;
  let isDragging = false, dragStartX = 0, dragScrollLeft = 0;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'services-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Service ${i + 1}`);
    dot.addEventListener('click', () => scrollToCard(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots(idx) {
    dotsContainer.querySelectorAll('.services-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  function scrollToCard(idx) {
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    currentIndex = idx;
    const card = cards[currentIndex];
    track.scrollTo({ left: card.offsetLeft - 4, behavior: 'smooth' });
    updateDots(currentIndex);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => scrollToCard(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollToCard(currentIndex + 1));

  // Mouse drag
  track.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX = e.pageX - track.offsetLeft;
    dragScrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  track.addEventListener('mouseleave', () => { isDragging = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup', () => { isDragging = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    track.scrollLeft = dragScrollLeft - (e.pageX - track.offsetLeft - dragStartX) * 1.5;
  });

  // Touch swipe
  let touchStart = 0;
  track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) scrollToCard(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  }, { passive: true });

  // Sync dot on manual scroll
  track.addEventListener('scroll', () => {
    const cardW = cards[0] ? cards[0].offsetWidth + 24 : 344;
    const idx = Math.round(track.scrollLeft / cardW);
    if (idx !== currentIndex) {
      currentIndex = Math.min(Math.max(idx, 0), total - 1);
      updateDots(currentIndex);
    }
  }, { passive: true });
}

// ===== CONTACT FORM → WHATSAPP =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cf-name').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();
    const service = document.getElementById('cf-service').value;
    const address = document.getElementById('cf-address').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !phone || !service) {
      showFormNotification('Please fill in all required fields.', 'error');
      return;
    }

    const waMessage = `Hello Prasad Enterprises! 👋

*New Service Enquiry*
━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${name}
📞 *Phone:* ${phone}
🔧 *Service:* ${service}
📍 *Area:* ${address || 'Not specified'}
💬 *Message:* ${message || 'Not specified'}
━━━━━━━━━━━━━━━━━━━

Please provide me with a quote and schedule a FREE site visit. Thank you!`;

    const encodedMessage = encodeURIComponent(waMessage);
    window.open(`https://wa.me/917799028484?text=${encodedMessage}`, '_blank');

    showFormNotification('Redirecting to WhatsApp... 🎉', 'success');
    form.reset();
  });
}

function showFormNotification(msg, type) {
  const existing = document.querySelector('.form-notification');
  if (existing) existing.remove();

  const notif = document.createElement('div');
  notif.className = `form-notification ${type}`;
  notif.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
  notif.style.cssText = `
    position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
    background: ${type === 'success' ? '#25d366' : '#e53935'};
    color: white; font-family: 'Outfit', sans-serif; font-weight: 600;
    padding: 14px 28px; border-radius: 100px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    z-index: 9998; display: flex; align-items: center; gap: 10px;
    animation: fadeUp 0.4s ease forwards;
    white-space: nowrap;
  `;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.transition = 'opacity 0.4s ease';
    setTimeout(() => notif.remove(), 400);
  }, 4000);
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ===== NAVBAR LOGO VISIBILITY =====
function initNavLogo() {
  // Show logo text if image fails silently
  const logoImg = document.querySelector('.logo-img');
  if (logoImg) {
    logoImg.addEventListener('error', () => {
      document.getElementById('logo-text-fallback').style.display = 'flex';
    });
  }
}

// ===== SERVICE CARD HOVER EFFECT =====
function initServiceCards() {
  const cards = document.querySelectorAll('.service-card:not(.cta-card)');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => {
        if (c !== card) c.style.opacity = '0.75';
      });
    });
    card.addEventListener('mouseleave', () => {
      cards.forEach(c => c.style.opacity = '1');
    });
  });
}

// ===== SAVE LOGO FROM USER PROVIDED IMAGE =====
// The logo is served from images/logo.png (copy the user's logo manually)
// If not found, fallback SVG is used in HTML

// ===== SCROLL TO TOP ON LOGO CLICK =====
function initLogoClick() {
  const logoLink = document.getElementById('nav-logo-link');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ===== WHATSAPP FLOAT BUTTON SHOW/HIDE =====
function initWAFloat() {
  const waBtn = document.getElementById('whatsapp-float');
  if (!waBtn) return;
  // Always visible, but animate in after small delay
  setTimeout(() => {
    waBtn.style.opacity = '1';
    waBtn.style.transform = 'scale(1)';
  }, 2200);
  waBtn.style.opacity = '0';
  waBtn.style.transform = 'scale(0)';
  waBtn.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
}

// ===== PRICING CARD HOVER INTERACTIONS =====
function initPricingCards() {
  document.querySelectorAll('.pricing-card:not(.featured)').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.background = 'var(--off-white)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
}

// ===== PARALLAX HERO BG =====
function initParallax() {
  const heroBg = document.querySelector('.hero-img');
  if (!heroBg || window.innerWidth < 768) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
    }
  }, { passive: true });
}

// ===== KEYBOARD ACCESSIBILITY =====
function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ===== COPY LOGO IMAGE =====
// Check if logo.png exists; handled by onerror fallbacks in HTML

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initScrollAnimations();
  animateCounters();
  initReviews();
  initServicesSlider();
  initGallery();
  initContactForm();
  initSmoothScroll();
  initNavLogo();
  initServiceCards();
  initLogoClick();
  initWAFloat();
  initParallax();
  initKeyboardNav();
  initGallery();

  // Trigger initial active nav
  updateActiveNavLink();
});

// ===== LIVE GALLERY =====
function initGallery() {
  const track = document.getElementById('gallery-track');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const dotsContainer = document.getElementById('gallery-dots');

  if (!track) return;

  const slots = track.querySelectorAll('.gallery-slot');
  const total = slots.length;
  let currentIndex = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragScrollLeft = 0;

  // Build dot buttons
  slots.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Gallery image ${i + 1}`);
    dot.addEventListener('click', () => scrollToSlot(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots(idx) {
    dotsContainer.querySelectorAll('.gallery-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  function scrollToSlot(idx) {
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    currentIndex = idx;
    const slot = slots[currentIndex];
    track.scrollTo({ left: slot.offsetLeft - 48, behavior: 'smooth' });
    updateDots(currentIndex);
  }

  // Arrow buttons (no auto-reset)
  if (prevBtn) prevBtn.addEventListener('click', () => scrollToSlot(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollToSlot(currentIndex + 1));

  // Mouse drag scroll
  track.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX = e.pageX - track.offsetLeft;
    dragScrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  track.addEventListener('mouseleave', () => { isDragging = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup', () => { isDragging = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    track.scrollLeft = dragScrollLeft - (e.pageX - track.offsetLeft - dragStartX) * 1.5;
  });

  // Touch swipe
  let touchStart = 0;
  track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) scrollToSlot(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  }, { passive: true });

  // Sync dot on manual scroll
  track.addEventListener('scroll', () => {
    const slotW = slots[0] ? slots[0].offsetWidth + 20 : 340;
    const idx = Math.round(track.scrollLeft / slotW);
    if (idx !== currentIndex) {
      currentIndex = Math.min(Math.max(idx, 0), total - 1);
      updateDots(currentIndex);
    }
  }, { passive: true });
}

// ===== PERFORMANCE: Lazy image loading fallback =====
if (!('IntersectionObserver' in window)) {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.removeAttribute('loading');
  });
}

// ===== GALLERY LIGHTBOX =====
(function initLightbox() {
  const overlay   = document.getElementById('gallery-lightbox');
  const lightImg  = document.getElementById('lightbox-img');
  const closeBtn  = document.getElementById('lightbox-close');
  const prevBtn   = document.getElementById('lightbox-prev');
  const nextBtn   = document.getElementById('lightbox-next');

  if (!overlay || !lightImg) return;

  // Collect all gallery images
  const galleryImgs = Array.from(document.querySelectorAll('.gallery-img'));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const img = galleryImgs[currentIndex];
    lightImg.src = img.src;
    lightImg.alt = img.alt;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateArrows();
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    lightImg.src = '';
  }

  function showPrev() {
    if (currentIndex > 0) openLightbox(currentIndex - 1);
  }

  function showNext() {
    if (currentIndex < galleryImgs.length - 1) openLightbox(currentIndex + 1);
  }

  function updateArrows() {
    prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
    prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
    nextBtn.style.opacity = currentIndex === galleryImgs.length - 1 ? '0.3' : '1';
    nextBtn.style.pointerEvents = currentIndex === galleryImgs.length - 1 ? 'none' : 'auto';
  }

  // Attach click to each gallery image
  galleryImgs.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
  });

  // Controls
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Click outside image to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });
})();
