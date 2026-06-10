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
// RENDER LEADERSHIP SECTION (formerly Historical Periods)
// ═══════════════════════════════════════════════════════════════

function renderPeriods() {
  const container = document.getElementById('periods-container');
  if (!container) return;

  // Leadership data (era-1 = Ban Lãnh Đạo, era-2 = Distinguished Artists)
  const leadershipData = [
    {
      role: 'Giám Đốc · Director',
      nameVi: 'Ông Phạm Văn Thắng',
      nameEn: 'Mr. Pham Van Thang',
      icon: '◈'
    },
    {
      role: 'Phó Giám Đốc · Vice Director',
      nameVi: 'Ông Lương Trung Kiên',
      nameEn: 'Mr. Luong Trung Kien',
      icon: '◇'
    },
    {
      role: 'Phó Giám Đốc · Vice Director',
      nameVi: 'Bà Nguyễn Thị Hương Giang',
      nameEn: 'Ms. Nguyen Thi Huong Giang',
      icon: '◇'
    },
    {
      role: 'Phó Giám Đốc · Vice Director',
      nameVi: 'Bà Nguyễn Thị Quý',
      nameEn: 'Ms. Nguyen Thi Quy',
      icon: '◇'
    }
  ];

  // Render leadership cards
  const directorsBlock = document.createElement('div');
  directorsBlock.className = 'leadership-cards stagger-item';
  directorsBlock.innerHTML = leadershipData.map((person, i) => `
    <div class="leader-card stagger-item" style="transition-delay:${i*80}ms;" tabindex="0">
      <div class="leader-card__icon">${person.icon}</div>
      <div class="leader-card__body">
        <div class="leader-card__role">${person.role}</div>
        <div class="leader-card__name-vi">${person.nameVi}</div>
        <div class="leader-card__name-en">${person.nameEn}</div>
      </div>
    </div>
  `).join('');
  container.appendChild(directorsBlock);

  // Artists block
  const artistsBlock = document.createElement('div');
  artistsBlock.className = 'artists-block fade-in-up';
  artistsBlock.style.marginTop = 'var(--space-12)';
  artistsBlock.innerHTML = `
    <div class="artists-block__header">
      <span class="label-mono">Nghệ sĩ · Artists</span>
      <h3 class="title-vi" style="font-size: var(--text-2xl); margin: var(--space-2) 0;">Các Nghệ Sĩ Tiêu Biểu</h3>
      <p class="title-en">Distinguished Artists</p>
    </div>
    <div class="artists-tags">
      <span class="artist-tag artist-tag--nsnd">NSND Thúy Cải</span>
      <span class="artist-tag artist-tag--nsnd">NSND Thúy Hường</span>
      <span class="artist-tag">NSƯT Khánh Hạ</span>
      <span class="artist-tag">NSƯT Lan Hương</span>
      <span class="artist-tag">NSƯT Hải Xuân</span>
      <span class="artist-tag">NSƯT Xuân Mùi</span>
      <span class="artist-tag">NSƯT Quang Vinh</span>
      <span class="artist-tag">NSƯT Lệ Ngải</span>
      <span class="artist-tag">NSƯT Hồng Mạnh</span>
      <span class="artist-tag">NSƯT Lệ Thanh</span>
      <span class="artist-tag artist-tag--more">và nhiều nghệ sĩ khác...</span>
    </div>
  `;
  container.appendChild(artistsBlock);
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
    const orientation = item.orientation || 'landscape';
    el.className = 'gallery-item scale-in';
    el.style.transitionDelay = `${i * 60}ms`;
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `Xem ${item.captionVi}`);
    el.dataset.galleryIndex = i;
    el.dataset.orientation = orientation;

    // Correct aspect ratio per orientation
    const w = orientation === 'portrait' ? 9 : 16;
    const h = orientation === 'portrait' ? 16 : 9;

    el.innerHTML = `
      <img src="${item.image}"
           alt="${item.captionVi} — ${item.captionEn}"
           loading="lazy"
           width="${w * 50}" height="${h * 50}"
           style="width:100%; height:100%; object-fit:cover; display:block;">
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

  // Show landscape items by default
  switchGalleryTab('landscape');

  // Build carousel
  renderCarousel();
}

// ═══════════════════════════════════════════════════════════════
// GALLERY CAROUSEL — infinite loop, shows 3 at once
// ═══════════════════════════════════════════════════════════════

function renderCarousel() {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (!track || !prevBtn || !nextBtn) return;

  const items = MUSEUM_DATA.gallery;
  if (!items || items.length === 0) return;

  // Clone items for seamless infinite loop (original + 2 clones on each side)
  const allItems = [...items, ...items, ...items]; // triple: end, original, start clones

  allItems.forEach((item, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `
      <img src="${item.image}"
           alt="${item.captionVi}"
           loading="lazy"
           draggable="false">
      <div class="carousel-slide-caption">
        <span class="caption-vi">${item.captionVi}</span>
        <span class="caption-en">${item.captionEn}</span>
      </div>
    `;
    slide.addEventListener('click', () => openLightbox(i % items.length));
    track.appendChild(slide);
  });

  const total = items.length;
  let current = total; // start at the "original" set (index = total, after first clone)
  let isTransitioning = false;

  function getSlideWidth() {
    const slide = track.querySelector('.carousel-slide');
    if (!slide) return 0;
    const gap = 16;
    return slide.offsetWidth + gap;
  }

  function goTo(index, animated = true) {
    if (animated) {
      track.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
      isTransitioning = true;
    } else {
      track.style.transition = 'none';
    }
    const slideW = getSlideWidth();
    track.style.transform = `translateX(-${index * slideW}px)`;
    current = index;
  }

  // Position initially (no animation)
  goTo(current, false);

  // After transition: jump to real set if we hit the clones
  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (current >= total * 2) {
      goTo(total, false);
    } else if (current < total) {
      goTo(total * 2 - total, false);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    goTo(current - 1);
  });

  nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    goTo(current + 1);
  });

  // Keyboard
  document.getElementById('gallery-carousel')?.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  // Touch/swipe
  let touchStartX = 0;
  const carousel = document.getElementById('gallery-carousel');
  carousel?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel?.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) dx > 0 ? nextBtn.click() : prevBtn.click();
  });

  // Auto-advance every 4s
  let autoTimer = setInterval(() => nextBtn.click(), 4000);
  carousel?.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carousel?.addEventListener('mouseleave', () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => nextBtn.click(), 4000);
  });

  // Recalculate on resize
  window.addEventListener('resize', () => goTo(current, false));
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
  const downloadBtn = document.getElementById('lightbox-download');

  img.src = item.image;
  img.alt = `${item.captionVi} — ${item.captionEn}`;
  document.getElementById('lightbox-caption-vi').textContent = item.captionVi;
  document.getElementById('lightbox-caption-en').textContent = item.captionEn;

  // Wire download button to current image
  if (downloadBtn) {
    downloadBtn.href = item.image;
    // Derive a clean filename from the image path
    const filename = item.image.split('/').pop() || `quan-ho-${lightboxIndex + 1}.jpg`;
    downloadBtn.setAttribute('download', filename);
  }
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

// ═══════════════════════════════════════════════════════════════
// GALLERY TAB SWITCHER (Landscape / Portrait)
// ═══════════════════════════════════════════════════════════════

function switchGalleryTab(mode) {
  const masonry = document.getElementById('gallery-masonry');
  const btnLandscape = document.getElementById('tab-landscape');
  const btnPortrait = document.getElementById('tab-portrait');

  if (!masonry) return;
  masonry.dataset.mode = mode;

  if (mode === 'landscape') {
    btnLandscape.className = 'btn btn-primary';
    btnPortrait.className = 'btn btn-outline';
    masonry.querySelectorAll('.gallery-item').forEach(el => {
      el.style.display = el.dataset.orientation === 'landscape' ? '' : 'none';
    });
  } else {
    btnPortrait.className = 'btn btn-primary';
    btnLandscape.className = 'btn btn-outline';
    masonry.querySelectorAll('.gallery-item').forEach(el => {
      el.style.display = el.dataset.orientation === 'portrait' ? '' : 'none';
    });
  }
}
