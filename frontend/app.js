// ============================================================
// APP.JS — Vietnam Military History Museum Landing Page
// Dynamic rendering, scroll animations, lightbox, chat widget
// ============================================================

// MUSEUM_DATA is now loaded from data.js

document.addEventListener('DOMContentLoaded', () => {
  try {
    initNavigation();
    initHeroParallax();
    renderAbout();
    renderPeriods();
    renderTimeline();
    renderGallery();
    renderVideos();
    // renderTestimonials(); // Section removed
    initScrollAnimations();
    initLightbox();
    initVideoLightbox();
    initAIChat();
    initSmoothScroll();

    // Trigger hero animations immediately
    setTimeout(() => {
      document.querySelectorAll('.hero .fade-in-up').forEach(el => {
        el.classList.add('visible');
      });
    }, 100);
  } catch (error) {
    console.error('Lỗi khi khởi tạo ứng dụng:', error);
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
// RENDER GALLERY — initialises the tab carousel
// ═══════════════════════════════════════════════════════════════

function renderGallery() {
  // Show landscape tab by default — this builds the carousel
  switchGalleryTab('landscape');
}

// ═══════════════════════════════════════════════════════════════
// TAB CAROUSEL — infinite loop, orientation-filtered
// Shows 3 landscape slides or 3 portrait slides at once.
// Portrait slides are narrower so we show 4 (better visual fill).
// ═══════════════════════════════════════════════════════════════

// Module-level state so resize / cleanup can reference it
let _tabCarousel = null;

function buildTabCarousel(items, orientation) {
  const track   = document.getElementById('tab-track');
  const prevBtn = document.getElementById('tab-prev');
  const nextBtn = document.getElementById('tab-next');
  const wrapper = document.getElementById('tab-carousel');
  if (!track || !prevBtn || !nextBtn || !wrapper) return;

  // Tear down previous instance
  if (_tabCarousel) {
    clearInterval(_tabCarousel.autoTimer);
    prevBtn.onclick = null;
    nextBtn.onclick = null;
    wrapper.onkeydown = null;
    wrapper.removeEventListener('touchstart', _tabCarousel.onTouchStart);
    wrapper.removeEventListener('touchend',   _tabCarousel.onTouchEnd);
    wrapper.removeEventListener('mouseenter', _tabCarousel.onMouseEnter);
    wrapper.removeEventListener('mouseleave', _tabCarousel.onMouseLeave);
    _tabCarousel = null;
  }

  // Clear slides
  track.innerHTML = '';

  if (!items || items.length === 0) return;

  // For portrait we show 4 per view (narrower cards); landscape shows 3.
  const visibleCount = orientation === 'portrait' ? 4 : 3;
  const GAP = 16;

  // Carry the real index so lightbox opens the correct image
  const globalItems = MUSEUM_DATA.gallery;

  // Triple-clone for seamless infinite loop
  const allItems = [...items, ...items, ...items];

  allItems.forEach((item) => {
    const realIndex = globalItems.indexOf(item);
    const slide = document.createElement('div');
    slide.className = `carousel-slide carousel-slide--${orientation}`;
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
    slide.addEventListener('click', () => openLightbox(realIndex >= 0 ? realIndex : 0));
    track.appendChild(slide);
  });

  const total = items.length;
  let current = total; // start at the 'original' set (after the first clone)
  let isTransitioning = false;

  function getSlideWidth() {
    const slide = track.querySelector('.carousel-slide');
    if (!slide) return 0;
    return slide.offsetWidth + GAP;
  }

  function goTo(index, animated = true) {
    if (animated) {
      track.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
      isTransitioning = true;
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = `translateX(-${index * getSlideWidth()}px)`;
    current = index;
  }

  goTo(current, false);

  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (current >= total * 2) goTo(total, false);
    else if (current < total) goTo(total, false);
  });

  const onPrev = () => { if (!isTransitioning) goTo(current - 1); };
  const onNext = () => { if (!isTransitioning) goTo(current + 1); };
  prevBtn.onclick = onPrev;
  nextBtn.onclick = onNext;

  // Keyboard
  wrapper.setAttribute('tabindex', '0');
  wrapper.onkeydown = e => {
    if (e.key === 'ArrowLeft')  onPrev();
    if (e.key === 'ArrowRight') onNext();
  };

  // Touch / swipe
  let touchStartX = 0;
  const onTouchStart = e => { touchStartX = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) dx > 0 ? onNext() : onPrev();
  };
  wrapper.addEventListener('touchstart', onTouchStart, { passive: true });
  wrapper.addEventListener('touchend',   onTouchEnd);

  // Auto-advance every 4.5 s
  let autoTimer = setInterval(onNext, 4500);
  const onMouseEnter = () => clearInterval(autoTimer);
  const onMouseLeave = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(onNext, 4500);
  };
  wrapper.addEventListener('mouseenter', onMouseEnter);
  wrapper.addEventListener('mouseleave', onMouseLeave);

  // Recalculate on resize
  window.addEventListener('resize', () => goTo(current, false));

  // Store state for teardown
  _tabCarousel = { autoTimer, onTouchStart, onTouchEnd, onMouseEnter, onMouseLeave };
}

// ═══════════════════════════════════════════════════════════════
// RENDER VIDEOS
// ═══════════════════════════════════════════════════════════════

function renderVideos() {
  const grid = document.getElementById('video-interviews');
  const { interviews, featured } = MUSEUM_DATA.videos;

  // Clear existing to prevent duplicates
  grid.innerHTML = '';

  // Helper to play youtube video
  const playYoutube = (container, youtubeId) => {
    container.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%; border-radius:inherit; z-index: 10;"></iframe>`;
  };

  // Interview cards (16:9)
  interviews.forEach((v, i) => {
    const card = document.createElement('div');
    card.className = 'video-card video-card-landscape stagger-item';
    card.style.transitionDelay = `${i * 60}ms`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Xem video ${v.titleVi}`);

    // Use YouTube thumbnail instead of initials
    const thumbUrl = `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`;

    card.innerHTML = `
      <div class="video-card-bg" style="background: url('${thumbUrl}') center/cover no-repeat;">
      </div>
      <div class="video-card-overlay">
        <div class="video-play-btn" aria-hidden="true"></div>
        <div class="video-card-info">
          <div class="title-vi">${v.titleVi}</div>
          <div class="role">${v.role}</div>
        </div>
      </div>
    `;

    // Open video lightbox instead of replacing card with iframe
    const openVL = () => openVideoLightbox({
      youtubeId: v.youtubeId,
      titleVi:   v.titleVi,
      titleEn:   v.titleEn || '',
      role:      v.role,
      aspect:    'landscape'
    });
    card.addEventListener('click', openVL);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVL(); }
    });

    grid.appendChild(card);
  });

  // Featured video
  document.getElementById('featured-video-title-vi').textContent = featured.titleVi;
  document.getElementById('featured-video-title-en').textContent = featured.titleEn;
  
  const featuredCard = document.getElementById('featured-video-card');
  const featuredBg = featuredCard.querySelector('.video-card-bg');
  
  // Update featured background with YouTube thumbnail
  const featuredThumb = `https://img.youtube.com/vi/${featured.youtubeId}/maxresdefault.jpg`;
  featuredBg.style.background = `url('${featuredThumb}') center/cover no-repeat`;
  featuredBg.innerHTML = ''; // Remove initials

  const openFeaturedVL = () => openVideoLightbox({
    youtubeId: featured.youtubeId,
    titleVi:   featured.titleVi,
    titleEn:   featured.titleEn || '',
    role:      '',
    aspect:    'landscape'
  });
  featuredCard.addEventListener('click', openFeaturedVL);
  featuredCard.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFeaturedVL(); }
  });
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
  const infoBtn = document.getElementById('lightbox-info-btn');

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigateLightbox(-1));
  nextBtn.addEventListener('click', () => navigateLightbox(1));
  infoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('lightbox-info-panel').classList.toggle('active');
  });

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
  document.getElementById('lightbox-info-panel').classList.remove('active');
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

  // Render info panel contents on load to get real dimensions
  const filename = item.image.split('/').pop() || `quan-ho-${lightboxIndex + 1}.jpg`;
  document.getElementById('lightbox-metadata').innerHTML = '<div style="text-align:center; padding: 10px;">Đang tải thông số...</div>';
  
  img.onload = () => {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const ratio = (w && h) ? (w/h).toFixed(2) : 'N/A';
    const fmt = filename.split('.').pop().toUpperCase();
    
    document.getElementById('lightbox-metadata').innerHTML = `
      <div class="metadata-row">
        <span class="metadata-label">File</span>
        <span class="metadata-value">${filename}</span>
      </div>
      <div class="metadata-row">
        <span class="metadata-label">Định dạng</span>
        <span class="metadata-value">${fmt}</span>
      </div>
      <div class="metadata-row">
        <span class="metadata-label">Kích thước</span>
        <span class="metadata-value">${w} × ${h} px</span>
      </div>
      <div class="metadata-row">
        <span class="metadata-label">Tỷ lệ (Ratio)</span>
        <span class="metadata-value">${ratio}</span>
      </div>
      <div class="metadata-row">
        <span class="metadata-label">Khung hình</span>
        <span class="metadata-value" style="text-transform: capitalize;">${item.orientation === 'landscape' ? 'Ngang (Landscape)' : 'Dọc (Portrait)'}</span>
      </div>
    `;
  };

  // Wire download button to current image
  if (downloadBtn) {
    downloadBtn.href = item.image;
    downloadBtn.setAttribute('download', filename);
  }
}

// ═══════════════════════════════════════════════════════════════
// VIDEO LIGHTBOX
// ═══════════════════════════════════════════════════════════════

let _vlCurrent = null; // current video data

function initVideoLightbox() {
  const modal     = document.getElementById('video-lightbox');
  const closeBtn  = document.getElementById('vl-close');
  const fsBtn     = document.getElementById('vl-fullscreen');
  const infoBtn   = document.getElementById('vl-info-btn');
  const infoPanel = document.getElementById('vl-info-panel');

  if (!modal) return;

  // Close
  closeBtn.addEventListener('click', closeVideoLightbox);
  modal.addEventListener('click', e => { if (e.target === modal) closeVideoLightbox(); });

  // Fullscreen — requests native fullscreen on the iframe container
  fsBtn.addEventListener('click', () => {
    const container = document.getElementById('vl-iframe-container');
    if (!container) return;
    const iframe = container.querySelector('iframe');
    const el = iframe || container;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
  });

  // Info panel toggle
  infoBtn.addEventListener('click', e => {
    e.stopPropagation();
    infoPanel.classList.toggle('active');
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeVideoLightbox();
  });
}

function openVideoLightbox({ youtubeId, titleVi, titleEn, role, aspect }) {
  _vlCurrent = { youtubeId, titleVi, titleEn, role, aspect };

  const modal      = document.getElementById('video-lightbox');
  const wrap       = document.getElementById('vl-player-wrap');
  const container  = document.getElementById('vl-iframe-container');
  const captionVi  = document.getElementById('vl-caption-vi');
  const captionEn  = document.getElementById('vl-caption-en');
  const metaEl     = document.getElementById('vl-metadata');
  const infoPanel  = document.getElementById('vl-info-panel');

  // Set aspect class
  wrap.classList.toggle('portrait', aspect === 'portrait');

  // Inject iframe (autoplay)
  container.innerHTML = `<iframe
    src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
    allowfullscreen
    title="${escapeHTML(titleVi)}"
  ></iframe>`;

  // Captions
  captionVi.textContent = titleVi;
  captionEn.textContent = role ? `${titleEn ? titleEn + ' — ' : ''}${role}` : titleEn;

  // Info panel metadata
  infoPanel.classList.remove('active');
  metaEl.innerHTML = `
    <div class="metadata-row">
      <span class="metadata-label">Tiêu đề</span>
      <span class="metadata-value">${escapeHTML(titleVi)}</span>
    </div>
    ${titleEn ? `<div class="metadata-row"><span class="metadata-label">Title (EN)</span><span class="metadata-value">${escapeHTML(titleEn)}</span></div>` : ''}
    ${role ? `<div class="metadata-row"><span class="metadata-label">Vai trò</span><span class="metadata-value">${escapeHTML(role)}</span></div>` : ''}
    <div class="metadata-row">
      <span class="metadata-label">Nền tảng</span>
      <span class="metadata-value">YouTube</span>
    </div>
    <div class="metadata-row">
      <span class="metadata-label">Video ID</span>
      <span class="metadata-value">${youtubeId}</span>
    </div>
    <div class="metadata-row">
      <span class="metadata-label">Định dạng</span>
      <span class="metadata-value">${aspect === 'portrait' ? 'Dọc 9:16' : 'Ngang 16:9'}</span>
    </div>
    <div class="metadata-row">
      <span class="metadata-label">Xem trực tiếp</span>
      <span class="metadata-value"><a href="https://youtu.be/${youtubeId}" target="_blank" rel="noopener" style="color:var(--color-accent);text-decoration:underline;">youtu.be/${youtubeId}</a></span>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('vl-close').focus();
}

function closeVideoLightbox() {
  const modal     = document.getElementById('video-lightbox');
  const container = document.getElementById('vl-iframe-container');
  const infoPanel = document.getElementById('vl-info-panel');

  modal.classList.remove('active');
  document.body.style.overflow = '';
  infoPanel.classList.remove('active');

  // Stop video by clearing iframe
  setTimeout(() => { container.innerHTML = ''; }, 300);
  _vlCurrent = null;
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
// GALLERY TAB SWITCHER — rebuilds carousel with filtered items
// ═══════════════════════════════════════════════════════════════

function switchGalleryTab(mode) {
  const btnLandscape = document.getElementById('tab-landscape');
  const btnPortrait  = document.getElementById('tab-portrait');

  // Update button active states
  if (mode === 'landscape') {
    btnLandscape.className = 'btn btn-primary';
    btnPortrait.className  = 'btn btn-outline';
  } else {
    btnPortrait.className  = 'btn btn-primary';
    btnLandscape.className = 'btn btn-outline';
  }

  // Filter gallery items by orientation
  const filtered = MUSEUM_DATA.gallery.filter(item =>
    (item.orientation || 'landscape') === mode
  );

  // (Re)build the carousel with the filtered subset
  buildTabCarousel(filtered, mode);
}

// ═══════════════════════════════════════════════════════════════
// DOCUMENT LIGHTBOX (PRESS KIT)
// ═══════════════════════════════════════════════════════════════

function openDocLightbox() {
  const lightbox = document.getElementById('doc-lightbox');
  if (lightbox) {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeDocLightbox() {
  const lightbox = document.getElementById('doc-lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function switchDocTab(tabId, btnElement) {
  // Update buttons
  const buttons = document.querySelectorAll('.doc-tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');

  // Update panes
  const panes = document.querySelectorAll('.doc-pane');
  panes.forEach(pane => pane.classList.remove('active'));
  
  const targetPane = document.getElementById(`doc-${tabId}`);
  if (targetPane) {
    targetPane.classList.add('active');
  }
}

// Add event listener to close when clicking outside container or pressing Escape
document.addEventListener('DOMContentLoaded', () => {
  const docLightbox = document.getElementById('doc-lightbox');
  if(docLightbox) {
    docLightbox.addEventListener('click', (e) => {
      if(e.target === docLightbox) {
        closeDocLightbox();
      }
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && docLightbox && docLightbox.classList.contains('active')) {
      closeDocLightbox();
    }
  });
});

