// ============================================================
// APP.JS — Vietnam Military History Museum Landing Page
// Dynamic rendering, scroll animations, lightbox, chat widget
// ============================================================

let MUSEUM_DATA = {};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Network response was not ok');
    MUSEUM_DATA = await response.json();
    
    initNavigation();
    initHeroParallax();
    renderAbout();
    renderPeriods();
    renderTimeline();
    renderGallery();
    renderVideos();
    renderTestimonials();
    initScrollAnimations();
    initLightbox();
    initAIChat();
    initSmoothScroll();

    // Trigger hero animations immediately
    setTimeout(() => {
      document.querySelectorAll('.hero .fade-in-up').forEach(el => {
        el.classList.add('visible');
      });
    }, 100);
  } catch (error) {
    console.error('Failed to load museum data:', error);
    document.body.innerHTML = '<h1 style="text-align:center; padding:50px;">Lỗi tải dữ liệu / Failed to load data. Vui lòng chạy trên localhost.</h1>';
  }
});

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════

function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navLinksContainer = document.getElementById('nav-links');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');

  // Render nav links
  MUSEUM_DATA.nav.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${item.id}`;
    a.className = 'nav-link';
    a.textContent = item.labelVi;
    a.setAttribute('title', item.labelEn);
    li.appendChild(a);
    navLinksContainer.appendChild(li);

    // Mobile nav
    const mobileA = a.cloneNode(true);
    mobileA.addEventListener('click', () => closeMobileNav());
    mobileNav.appendChild(mobileA);
  });

  // Scroll detection
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  function closeMobileNav() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Close mobile nav on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMobileNav();
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// HERO PARALLAX
// ═══════════════════════════════════════════════════════════════

function initHeroParallax() {
  const heroBg = document.getElementById('hero-bg');
  if (!heroBg) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;
        if (scrollY < heroHeight) {
          heroBg.style.transform = `translateY(${scrollY * 0.35}px) scale(1.05)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════════════
// RENDER ABOUT SECTION
// ═══════════════════════════════════════════════════════════════

function renderAbout() {
  const { about } = MUSEUM_DATA;

  document.getElementById('about-content-vi').textContent = about.contentVi;
  document.getElementById('about-content-en').textContent = about.contentEn;

  const statsContainer = document.getElementById('about-stats');
  about.stats.forEach(stat => {
    const div = document.createElement('div');
    div.className = 'stat-item';
    div.innerHTML = `
      <div class="stat-value">${stat.value}</div>
      <div class="stat-label">${stat.labelVi}<br><em style="font-size: 0.8em; color: var(--color-text-light);">${stat.labelEn}</em></div>
    `;
    statsContainer.appendChild(div);
  });
}

// ═══════════════════════════════════════════════════════════════
// RENDER HISTORICAL PERIODS
// ═══════════════════════════════════════════════════════════════

function renderPeriods() {
  const container = document.getElementById('periods-container');

  MUSEUM_DATA.periods.forEach((era, eraIndex) => {
    const eraEl = document.createElement('div');
    eraEl.className = 'era fade-in-up';
    eraEl.id = era.id;

    let artifactsHTML = '';
    era.artifacts.forEach((artifact, i) => {
      artifactsHTML += `
        <div class="artifact-card stagger-item"
             style="transition-delay: ${i * 50}ms;"
             tabindex="0"
             role="button"
             aria-label="${artifact.captionVi}"
             data-gallery-index="${i}"
             data-era="${era.id}">
          <div style="overflow: hidden;">
            <img src="${artifact.image}"
                 alt="${artifact.captionVi} — ${artifact.captionEn}"
                 loading="lazy"
                 width="400" height="300">
          </div>
          <div class="artifact-caption">
            <div class="caption-vi">${artifact.captionVi}</div>
            <div class="caption-en">${artifact.captionEn}</div>
          </div>
        </div>
      `;
    });

    eraEl.innerHTML = `
      <div class="era-header">
        <div class="era-years">${era.years}</div>
        <div class="era-info">
          <h3 class="title-vi">${era.titleVi}</h3>
          <p class="title-en">${era.titleEn}</p>
          <p class="era-desc">${era.descVi}</p>
        </div>
      </div>
      <div class="era-artifacts">
        ${artifactsHTML}
      </div>
    `;

    container.appendChild(eraEl);
  });
}

// ═══════════════════════════════════════════════════════════════
// RENDER TIMELINE
// ═══════════════════════════════════════════════════════════════

function renderTimeline() {
  const track = document.getElementById('timeline-track');

  MUSEUM_DATA.timeline.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'timeline-item stagger-item';
    el.style.transitionDelay = `${i * 40}ms`;
    el.setAttribute('role', 'listitem');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `${item.year}: ${item.titleVi}`);

    el.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-year">${item.year}</div>
      <div class="timeline-title-vi">${item.titleVi}</div>
      <div class="timeline-title-en">${item.titleEn}</div>
      <div class="timeline-desc">${item.descVi}</div>
    `;

    el.addEventListener('click', () => {
      // Toggle active state
      const wasActive = el.classList.contains('active');
      track.querySelectorAll('.timeline-item').forEach(ti => ti.classList.remove('active'));
      if (!wasActive) el.classList.add('active');
    });

    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });

    track.appendChild(el);
  });
}

// ═══════════════════════════════════════════════════════════════
// RENDER GALLERY (Masonry)
// ═══════════════════════════════════════════════════════════════

function renderGallery() {
  const masonry = document.getElementById('gallery-masonry');

  MUSEUM_DATA.gallery.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'gallery-item scale-in';
    el.style.transitionDelay = `${i * 60}ms`;
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `Xem ${item.captionVi}`);
    el.dataset.galleryIndex = i;

    el.innerHTML = `
      <img src="${item.image}"
           alt="${item.captionVi} — ${item.captionEn}"
           loading="lazy"
           width="400" height="300">
      <div class="gallery-item-overlay">
        <div>
          <div class="caption-vi">${item.captionVi}</div>
          <div class="caption-en">${item.captionEn}</div>
        </div>
      </div>
    `;

    el.addEventListener('click', () => openLightbox(i));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });

    masonry.appendChild(el);
  });
}

// ═══════════════════════════════════════════════════════════════
// RENDER VIDEOS
// ═══════════════════════════════════════════════════════════════

function renderVideos() {
  const grid = document.getElementById('video-interviews');
  const { interviews, featured } = MUSEUM_DATA.videos;

  // Interview cards (9:16)
  interviews.forEach((v, i) => {
    const card = document.createElement('div');
    card.className = 'video-card video-card-portrait stagger-item';
    card.style.transitionDelay = `${i * 60}ms`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Xem phỏng vấn ${v.titleVi}`);

    const initials = v.titleVi.split(' ').map(w => w[0]).join('').slice(0, 2);

    card.innerHTML = `
      <div class="video-card-bg">
        <span class="initials" aria-hidden="true">${initials}</span>
      </div>
      <div class="video-card-overlay">
        <div class="video-play-btn" aria-hidden="true"></div>
        <div class="video-card-info">
          <div class="title-vi">${v.titleVi}</div>
          <div class="role">${v.role}</div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Featured video
  document.getElementById('featured-video-title-vi').textContent = featured.titleVi;
  document.getElementById('featured-video-title-en').textContent = featured.titleEn;
}

// ═══════════════════════════════════════════════════════════════
// RENDER TESTIMONIALS
// ═══════════════════════════════════════════════════════════════

function renderTestimonials() {
  const scroll = document.getElementById('testimonials-scroll');

  MUSEUM_DATA.testimonials.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card stagger-item';
    card.style.transitionDelay = `${i * 80}ms`;
    card.setAttribute('role', 'listitem');

    card.innerHTML = `
      <div class="testimonial-quote-mark" aria-hidden="true">"</div>
      <p class="testimonial-quote-vi">${t.quoteVi}</p>
      <p class="testimonial-quote-en">"${t.quoteEn}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar" aria-hidden="true">${t.avatar}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.roleVi} — <em>${t.roleEn}</em></div>
        </div>
      </div>
    `;

    scroll.appendChild(card);
  });
}

// ═══════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS (IntersectionObserver)
// ═══════════════════════════════════════════════════════════════

function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .stagger-item')
    .forEach(el => {
      // Don't re-observe hero elements (already animated)
      if (!el.closest('.hero')) {
        observer.observe(el);
      }
    });
}

// ═══════════════════════════════════════════════════════════════
// LIGHTBOX
// ═══════════════════════════════════════════════════════════════

let lightboxIndex = 0;
const lightboxItems = () => MUSEUM_DATA.gallery;

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigateLightbox(-1));
  nextBtn.addEventListener('click', () => navigateLightbox(1));

  // Click backdrop to close
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox(index) {
  lightboxIndex = index;
  updateLightboxContent();
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focus management
  document.getElementById('lightbox-close').focus();
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  const items = lightboxItems();
  lightboxIndex = (lightboxIndex + direction + items.length) % items.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const items = lightboxItems();
  const item = items[lightboxIndex];
  const img = document.getElementById('lightbox-image');

  img.src = item.image;
  img.alt = `${item.captionVi} — ${item.captionEn}`;
  document.getElementById('lightbox-caption-vi').textContent = item.captionVi;
  document.getElementById('lightbox-caption-en').textContent = item.captionEn;
}

// ═══════════════════════════════════════════════════════════════
// AI CHAT WIDGET
// ═══════════════════════════════════════════════════════════════

function initAIChat() {
  const toggle = document.getElementById('ai-chat-toggle');
  const panel = document.getElementById('ai-chat-panel');
  const closeBtn = document.getElementById('ai-chat-close');
  const input = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-chat-send');
  const contextEl = document.getElementById('ai-chat-context');

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      // Small delay for animation
      setTimeout(() => input.focus(), 300);
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  });

  // Placeholder send
  sendBtn.addEventListener('click', () => handleChatSend());
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleChatSend();
  });

  function handleChatSend() {
    const message = input.value.trim();
    if (!message) return;
    input.value = '';

    const body = panel.querySelector('.ai-chat-body');
    const msgEl = document.createElement('div');
    msgEl.style.cssText = `
      background: var(--color-bg-alt);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-lg);
      margin-top: var(--space-3);
      font-size: var(--text-sm);
    `;
    msgEl.innerHTML = `
      <strong style="color: var(--color-accent);">Bạn:</strong> ${escapeHTML(message)}
      <div style="margin-top: var(--space-2); color: var(--color-text-muted); font-style: italic; font-size: 0.85em;">
        🤖 Tính năng đang phát triển — Feature coming soon...
      </div>
    `;
    body.appendChild(msgEl);
    body.scrollTop = body.scrollHeight;
  }

  // Context-aware: detect which section user is viewing
  const sectionNames = {
    hero: 'Trang chủ',
    about: 'Giới thiệu',
    periods: 'Lịch sử',
    timeline: 'Niên biểu',
    gallery: 'Hiện vật',
    videos: 'Video',
    visitors: 'Khách tham quan',
    cta: 'Tham quan',
  };

  const sections = Object.keys(sectionNames).map(id => document.getElementById(id)).filter(Boolean);

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const name = sectionNames[entry.target.id] || entry.target.id;
          contextEl.textContent = `📍 Đang xem: ${name}`;
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(s => sectionObserver.observe(s));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('active')) {
      panel.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════════════════════════════

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
