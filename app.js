/**
 * GHANSHYAM KUMAR SINGH — PORTFOLIO V2 JAVASCRIPT ENGINE
 * Animation orchestration, theme switching, count-up numbers,
 * interactive diagrams, and navigation tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  initMobileMenu();
  initScrollAnimations();
  initCountUpMetrics();
  initTimelineAnimation();
  initNavTracking();
});

/* --------------------------------------------------------------------------
   1. THEME ENGINE (Light / Dark with LocalStorage)
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const mobileToggleBtn = document.getElementById('mobile-theme-toggle');
  
  // Detect saved preference or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  function toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggle);
  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', toggle);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
  
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

/* --------------------------------------------------------------------------
   2. HEADER GLASSMORPHISM ON SCROLL
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

/* --------------------------------------------------------------------------
   3. MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-btn');
  const overlay = document.getElementById('mobile-overlay');
  const closeBtns = document.querySelectorAll('.close-mobile-menu, .mobile-nav-link');

  if (!openBtn || !overlay) return;

  function openMenu() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openMenu);
  closeBtns.forEach(btn => btn.addEventListener('click', closeMenu));
}

/* --------------------------------------------------------------------------
   4. SCROLL REVEAL (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. COUNT-UP METRICS ENGINE
   -------------------------------------------------------------------------- */
function initCountUpMetrics() {
  const metricElements = document.querySelectorAll('[data-count-to]');
  if (!metricElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.25
  });

  metricElements.forEach(el => observer.observe(el));
}

function animateCountUp(element) {
  const rawTarget = element.getAttribute('data-count-to');
  const prefix = element.getAttribute('data-prefix') || '';
  const suffix = element.getAttribute('data-suffix') || '';
  const targetNum = parseFloat(rawTarget);
  
  if (isNaN(targetNum)) {
    element.textContent = prefix + rawTarget + suffix;
    return;
  }

  const duration = 1400; // ms
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out expo
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentVal = Math.round(easeProgress * targetNum);

    element.textContent = prefix + currentVal + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = prefix + targetNum + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* --------------------------------------------------------------------------
   6. CAREER JOURNEY TIMELINE SVG DRAWING
   -------------------------------------------------------------------------- */
function initTimelineAnimation() {
  const timelineSection = document.querySelector('.journey-section');
  const animatedPath = document.querySelector('.timeline-svg-line line.animated-path');
  const nodes = document.querySelectorAll('.timeline-node');

  if (!timelineSection || !animatedPath) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger SVG line drawing
        animatedPath.style.strokeDashoffset = '0';

        // Stagger node activation
        nodes.forEach((node, idx) => {
          setTimeout(() => {
            node.classList.add('active');
          }, 200 + (idx * 160));
        });

        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  observer.observe(timelineSection);
}

/* --------------------------------------------------------------------------
   7. NAVIGATION ACTIVE SECTION TRACKING
   -------------------------------------------------------------------------- */
function initNavTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}
