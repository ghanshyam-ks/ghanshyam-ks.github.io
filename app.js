/**
 * GHANSHYAM KUMAR SINGH — PORTFOLIO JAVASCRIPT ENGINE
 * Animation orchestration, theme switching, count-up numbers,
 * 1-click clipboard actions, category filters, and navigation tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  initMobileMenu();
  initScrollAnimations();
  initCountUpMetrics();
  initTimelineAnimation();
  initNavTracking();
  initEmailCopy();
  initContactAnchorScroll();
  initWorkFilters();
  initFloatingNav();
  initCaseStudyToc();
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

  // Listen to system preference changes if no saved theme
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('change', (e) => {
      applyTheme(e.target.checked ? 'dark' : 'light');
    });
  }
  
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('change', (e) => {
      applyTheme(e.target.checked ? 'dark' : 'light');
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
  
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.checked = (theme === 'dark');
    toggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }

  const mobileToggleBtn = document.getElementById('mobile-theme-toggle');
  if (mobileToggleBtn) {
    mobileToggleBtn.checked = (theme === 'dark');
    mobileToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }

  const mobileThemeStatus = document.getElementById('mobile-theme-status');
  if (mobileThemeStatus) {
    mobileThemeStatus.textContent = (theme === 'dark') ? 'Dark Mode' : 'Light Mode';
  }
}

/* --------------------------------------------------------------------------
   2. HEADER GLASSMORPHISM ON SCROLL
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 30) {
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
  const closeBtns = document.querySelectorAll('.close-mobile-menu, .mobile-nav-link, .mobile-drawer-cta');

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
   4. SCROLL REVEAL (IntersectionObserver - Fast)
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
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. COUNT-UP METRICS ENGINE (Snappy 550ms)
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
    threshold: 0.15
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

  const duration = 550; // ms (fast and snappy)
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
        animatedPath.style.strokeDashoffset = '0';

        nodes.forEach((node, idx) => {
          setTimeout(() => {
            node.classList.add('active');
          }, 150 + (idx * 100));
        });

        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  observer.observe(timelineSection);
}

/* --------------------------------------------------------------------------
   7. NAVIGATION ACTIVE SECTION TRACKING (Multi-page aware)
   -------------------------------------------------------------------------- */
function initNavTracking() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Highlight active page in nav
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === 'index.html' && (href === '#' || href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // Track sections on current page if any
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else if (href.startsWith('#')) {
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

/* --------------------------------------------------------------------------
   8. 1-CLICK CLIPBOARD COPY (Email & Phone)
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const copyEmailBtns = document.querySelectorAll('[data-copy-email]');
  const copyPhoneBtns = document.querySelectorAll('[data-copy-phone]');
  if (!copyEmailBtns.length && !copyPhoneBtns.length) return;

  // Create toast element once
  let toast = document.getElementById('portfolio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portfolio-toast';
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Copied to clipboard!</span>
    `;
    document.body.appendChild(toast);
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(successMsg);
  }

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'ghanshyamrock05@gmail.com';
      copyToClipboard(email, 'Email copied to clipboard: ' + email);
    });
  });

  copyPhoneBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = btn.getAttribute('data-copy-phone') || '+91 8804041515';
      copyToClipboard(phone, 'Phone number copied: ' + phone);
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

/* --------------------------------------------------------------------------
   8B. CONTACT ANCHOR SMOOTH SCROLL & EXECUTIVE PULSE
   -------------------------------------------------------------------------- */
function initContactAnchorScroll() {
  function checkAndHighlightContact() {
    if (window.location.hash === '#contact' || window.location.hash === '#vip-access') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        contactSection.classList.add('target-active');
        setTimeout(() => {
          contactSection.classList.remove('target-active');
        }, 2200);
      }
    }
  }

  // Handle in-page smooth clicks to #contact
  document.querySelectorAll('a[href="#contact"], a[href="#vip-access"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.getElementById('contact');
      if (target) {
        e.preventDefault();
        history.pushState(null, '', '#contact');
        target.scrollIntoView({ behavior: 'smooth' });
        target.classList.add('target-active');
        setTimeout(() => {
          target.classList.remove('target-active');
        }, 2200);
      }
    });
  });

  // Run on initial page load if hash exists
  if (window.location.hash === '#contact' || window.location.hash === '#vip-access') {
    setTimeout(checkAndHighlightContact, 150);
  }
}

/* --------------------------------------------------------------------------
   9. CATEGORY FILTERING (work.html)
   -------------------------------------------------------------------------- */
function initWorkFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('[data-category]');

  if (!filterBtns.length || !workCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      workCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory.includes(category)) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   10. FLOATING NAVIGATION PILL (Scroll-activated Back to Top / Work)
   -------------------------------------------------------------------------- */
function initFloatingNav() {
  const floatingPill = document.querySelector('.floating-nav-pill');
  if (!floatingPill) return;

  function handleScroll() {
    if (window.scrollY > 450) {
      floatingPill.classList.add('visible');
    } else {
      floatingPill.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   11. CASE STUDY TABLE OF CONTENTS TRACKING
   -------------------------------------------------------------------------- */
function initCaseStudyToc() {
  const tocLinks = document.querySelectorAll('.toc-link');
  const sections = document.querySelectorAll('.cs-deep-section');

  if (!tocLinks.length || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '-80px 0px -60% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}

// --------------------------------------------------------------------------
// Cinematic Parallel BlurText Animation Trigger
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const blurRows = document.querySelectorAll('.blur-text-row');
  if (blurRows.length > 0) {
    const triggerBlurAnimation = () => {
      blurRows.forEach((row) => {
        row.classList.add('is-in-view');
      });
    };
    
    // Trigger on requestAnimationFrame for smooth entry
    requestAnimationFrame(() => {
      setTimeout(triggerBlurAnimation, 80);
    });
  }
});
