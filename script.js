/* ============================================
   PORTFOLIO — INTERACTIVE JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initScrollReveal();
  initCounterAnimation();
  initBackToTop();
  initSmoothScroll();
  initContactForm();
  initActiveNavLink();
});

/* ============================================
   THEME TOGGLE (Dark / Light Mode)
   ============================================ */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Check for saved preference or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);

    // Add a subtle animation
    toggle.style.transform = 'rotate(360deg) scale(0.8)';
    setTimeout(() => {
      toggle.style.transform = '';
    }, 300);
  });
}

/* ============================================
   NAVBAR — Scroll effect + Mobile menu
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   SCROLL REVEAL — Intersection Observer
   ============================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: reveal all immediately
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* ============================================
   COUNTER ANIMATION — Hero stats
   ============================================ */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.hero-stat-number[data-count]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(counter => observer.observe(counter));
  } else {
    counters.forEach(counter => {
      counter.textContent = counter.getAttribute('data-count');
    });
  }
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ============================================
   SMOOTH SCROLL — Anchor links
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'));
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================
   ACTIVE NAV LINK — Highlight on scroll
   ============================================ */
function initActiveNavLink() {
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-80px 0px -50% 0px'
      }
    );

    sections.forEach(section => observer.observe(section));
  }
}

/* ============================================
   CONTACT FORM — Validation & UX
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple form validation
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showFormFeedback('Harap isi semua kolom yang wajib diisi.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormFeedback('Harap masukkan alamat email yang valid.', 'error');
      return;
    }

    // Simulate form submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>
      Mengirim...
    `;

    setTimeout(() => {
      showFormFeedback('Terima kasih! Pesan Anda telah berhasil dikirim.', 'success');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        Kirim Pesan
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      `;
    }, 1500);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormFeedback(message, type) {
  // Remove existing feedback
  const existing = document.querySelector('.form-feedback');
  if (existing) existing.remove();

  const feedback = document.createElement('div');
  feedback.className = `form-feedback form-feedback-${type}`;
  feedback.textContent = message;

  // Style the feedback inline
  Object.assign(feedback.style, {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: '500',
    marginTop: '0.5rem',
    animation: 'fadeInUp 0.3s ease',
    background: type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: type === 'success' ? '#10b981' : '#ef4444',
    border: `1px solid ${type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
  });

  const form = document.getElementById('contact-form');
  form.appendChild(feedback);

  // Auto-remove after 5s
  setTimeout(() => {
    feedback.style.opacity = '0';
    feedback.style.transform = 'translateY(-10px)';
    feedback.style.transition = 'all 0.3s ease';
    setTimeout(() => feedback.remove(), 300);
  }, 5000);
}

/* ============================================
   UTILITY — Add fadeInUp keyframe dynamically
   ============================================ */
(function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .spinner {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
})();
