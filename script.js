/* ================================================================
   ARCLIGHT STUDIOS - script.js
   Interactive JavaScript: Preloader, Cursor, Nav, Hero Particles,
   Scroll Animations, Counter, Portfolio Filter, Testimonial Carousel,
   Contact Form Validation
   ================================================================ */

'use strict';

/* ── Utility ────────────────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ================================================================
   1. PRELOADER
   ================================================================ */
function initPreloader() {
  const preloader = qs('#preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      // Trigger hero animations after preloader hides
      initHeroParticles();
      initCounters();
    }, 500);
  });

  // Fallback - hide after 3.5s
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 3500);
}

/* ================================================================
   2. CUSTOM CURSOR
   ================================================================ */
function initCursor() {
  const cursor   = qs('#cursor');
  const follower = qs('#cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower via RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  const hoverEls = qsa('a, button, .filter-btn, .portfolio-item, .service-card, .testimonials__btn, .testimonials__dot, .contact__social');

  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      follower.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('cursor--hover');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
}

/* ================================================================
   3. NAVIGATION
   ================================================================ */
function initNav() {
  const navbar    = qs('#navbar');
  const hamburger = qs('#hamburger');
  const navLinks  = qs('#navLinks');
  if (!navbar) return;

  // Sticky scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    qsa('.nav__link', navLinks).forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Active link highlight on scroll
  const sections = qsa('section[id]');
  const navLinkEls = qsa('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinkEls.forEach(link => {
          link.classList.toggle('nav__link--active',
            link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));
}

/* ================================================================
   4. HERO PARTICLES
   ================================================================ */
function initHeroParticles() {
  const container = qs('#heroParticles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 25 : 55;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 2.5 + 1;
    p.style.cssText = [
      'left:'   + Math.random() * 100 + '%',
      'top:'    + (Math.random() * 60 + 40) + '%',
      'width:'  + size + 'px',
      'height:' + size + 'px',
      '--dur:'  + (Math.random() * 5 + 3) + 's',
      '--del:'  + (Math.random() * 6) + 's',
      '--op:'   + (Math.random() * 0.5 + 0.2)
    ].join(';');
    container.appendChild(p);
  }
}

/* ================================================================
   5. SCROLL-TRIGGERED ANIMATIONS
   ================================================================ */
function initScrollAnimations() {
  const animated = qsa('[data-animate]');
  if (!animated.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('is-visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  animated.forEach(el => observer.observe(el));
}

/* ================================================================
   6. COUNTER ANIMATION
   ================================================================ */
function initCounters() {
  const counters = qsa('[data-count]');
  if (!counters.length) return;

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count);
    const duration = 2200;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
}

/* ================================================================
   7. PORTFOLIO FILTER
   ================================================================ */
function initPortfolioFilter() {
  const filterBtns = qsa('.filter-btn');
  const items      = qsa('.portfolio-item');
  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      const filter = btn.dataset.filter;

      items.forEach((item, idx) => {
        const cat    = item.dataset.category;
        const show   = filter === 'all' || cat === filter;

        if (show) {
          item.classList.remove('hidden');
          item.style.transitionDelay = (idx * 40) + 'ms';
        } else {
          item.classList.add('hidden');
          item.style.transitionDelay = '0ms';
        }
      });
    });
  });
}

/* ================================================================
   8. TESTIMONIAL CAROUSEL
   ================================================================ */
function initTestimonialsCarousel() {
  const track    = qs('#testimonialsTrack');
  const dotsWrap = qs('#testimonialDots');
  const prevBtn  = qs('#prevTestimonial');
  const nextBtn  = qs('#nextTestimonial');
  if (!track) return;

  const cards    = qsa('.testimonial-card', track);
  let current    = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonials__dot' + (i === 0 ? ' testimonials__dot--active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    track.style.transform = 'translateX(-' + current * 100 + '%)';
    qsa('.testimonials__dot', dotsWrap).forEach((dot, i) => {
      dot.classList.toggle('testimonials__dot--active', i === current);
    });
    resetTimer();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5000);
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  });

  resetTimer();
}

/* ================================================================
   9. CONTACT FORM
   ================================================================ */
function initContactForm() {
  const form    = qs('#contactForm');
  const success = qs('#formSuccess');
  if (!form) return;

  function showError(group, msg) {
    group.classList.add('has-error');
    let errEl = qs('.form-error-msg', group);
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'form-error-msg';
      group.appendChild(errEl);
    }
    errEl.textContent = msg;
  }

  function clearError(group) {
    group.classList.remove('has-error');
    const errEl = qs('.form-error-msg', group);
    if (errEl) errEl.remove();
  }

  // Real-time validation
  qsa('.form-input, .form-select, .form-textarea', form).forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) clearError(group);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Name
    const nameGrp = qs('#form-name-group');
    const name    = qs('#form-name').value.trim();
    if (!name) { showError(nameGrp, 'Please enter your full name.'); isValid = false; }
    else clearError(nameGrp);

    // Email
    const emailGrp = qs('#form-email-group');
    const email    = qs('#form-email').value.trim();
    const emailRe  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRe.test(email)) { showError(emailGrp, 'Please enter a valid email address.'); isValid = false; }
    else clearError(emailGrp);

    // Service
    const serviceGrp = qs('#form-service-group');
    const service    = qs('#form-service').value;
    if (!service) { showError(serviceGrp, 'Please select a service.'); isValid = false; }
    else clearError(serviceGrp);

    // Message
    const msgGrp = qs('#form-message-group');
    const msg    = qs('#form-message').value.trim();
    if (!msg || msg.length < 10) { showError(msgGrp, 'Please tell us a bit more about your vision.'); isValid = false; }
    else clearError(msgGrp);

    if (!isValid) return;

    // Simulate submission
    const submitBtn = qs('#form-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending\u2026</span>';

    setTimeout(() => {
      form.style.display = 'none';
      if (success) {
        success.style.display = 'flex';
        success.style.animation = 'none';
        requestAnimationFrame(() => {
          success.style.animation = '';
        });
      }
    }, 1400);
  });
}

/* ================================================================
   10. SMOOTH SCROLL
   ================================================================ */
function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = qs(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });
}

/* ================================================================
   11. SCROLL PROGRESS BAR
   ================================================================ */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,hsl(38,65%,61%),hsl(42,80%,72%));z-index:9999;transition:width 0.1s;width:0%;pointer-events:none;';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / total * 100) + '%';
  }, { passive: true });
}

/* ================================================================
   12. PROCESS STEP HIGHLIGHT
   ================================================================ */
function initProcessStepHighlight() {
  const steps = qsa('.process__step');
  if (!steps.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.5 });

  steps.forEach(s => obs.observe(s));
}

/* ================================================================
   13. BACK TO TOP
   ================================================================ */
function initBackToTop() {
  const btn = qs('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================================================================
   14. PORTFOLIO LIGHTBOX
   ================================================================ */
function initLightbox() {
  const lightbox   = qs('#lightbox');
  const lbImg      = qs('#lightboxImg');
  const lbTitle    = qs('#lightboxTitle');
  const lbLoc      = qs('#lightboxLoc');
  const lbClose    = qs('#lightboxClose');
  const lbPrev     = qs('#lightboxPrev');
  const lbNext     = qs('#lightboxNext');
  if (!lightbox || !lbImg) return;

  // Build data array from visible portfolio items
  const items = qsa('.portfolio-item');
  let current = 0;

  function getItemData(item) {
    const visual = qs('.portfolio-item__visual', item);
    const style  = getComputedStyle(visual).backgroundImage;
    const urlMatch = style.match(/url\(["']?([^"')]+)["']?\)/);
    const src    = urlMatch ? urlMatch[1] : null;
    const title  = qs('.portfolio-item__title', item)?.textContent || '';
    const loc    = qs('.portfolio-item__loc',   item)?.textContent || '';
    const cat    = qs('.portfolio-item__cat',   item)?.textContent || '';
    return { src, title, loc: cat + ' · ' + loc };
  }

  function openAt(idx) {
    const visibleItems = items.filter(i => !i.classList.contains('hidden'));
    if (!visibleItems.length) return;
    current = (idx + visibleItems.length) % visibleItems.length;
    const data = getItemData(visibleItems[current]);
    if (!data.src) return;
    lbImg.src        = data.src;
    lbImg.alt        = data.title;
    lbTitle.textContent = data.title;
    lbLoc.textContent   = data.loc;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Store ref to visible items for nav
    lightbox._items   = visibleItems;
    lightbox._current = current;
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  function navigate(dir) {
    const visibleItems = lightbox._items || items.filter(i => !i.classList.contains('hidden'));
    openAt((lightbox._current + dir + visibleItems.length) % visibleItems.length);
  }

  // Attach click listeners to portfolio items
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      const visibleItems = items.filter(it => !it.classList.contains('hidden'));
      const visIdx = visibleItems.indexOf(item);
      if (visIdx !== -1) openAt(visIdx);
    });
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => navigate(-1));
  lbNext.addEventListener('click', () => navigate(1));

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowRight')  navigate(1);
    if (e.key === 'ArrowLeft')   navigate(-1);
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) navigate(diff > 0 ? 1 : -1);
  });
}

/* ================================================================
   BOOT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Lock scroll during preloader
  document.body.style.overflow = 'hidden';

  initPreloader();
  initCursor();
  initNav();
  initScrollAnimations();
  initPortfolioFilter();
  initTestimonialsCarousel();
  initContactForm();
  initSmoothScroll();
  initScrollProgress();
  initProcessStepHighlight();
  initBackToTop();
  initLightbox();
});
