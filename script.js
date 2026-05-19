/* ============================================================
   GLOW SKIN & AESTHETICS CLINIC — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Init AOS ─────────────────────────────────────────────
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  // ── Sticky Navbar ─────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ── Mobile Hamburger ──────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Smooth Active Nav Link Highlight ─────────────────────
  const sections   = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  function highlightNav() {
    let scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  // ── FAQ Accordion ─────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Animated Counter ──────────────────────────────────────
  const counters    = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;

    const rect = statsBar.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      countersStarted = true;
      counters.forEach(counter => {
        const target   = parseInt(counter.dataset.target, 10);
        const duration = 1800;
        const step     = Math.max(1, Math.floor(target / (duration / 16)));
        let current    = 0;

        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          counter.textContent = current.toLocaleString();
          if (current >= target) clearInterval(timer);
        }, 16);
      });
    }
  }

  window.addEventListener('scroll', startCounters, { passive: true });
  startCounters();

  // ── Contact Form Validation & Submission ─────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;

      // Helper
      function setError(fieldId, errId, msg) {
        const field = document.getElementById(fieldId);
        const err   = document.getElementById(errId);
        if (msg) {
          field.classList.add('error');
          if (err) err.textContent = msg;
          valid = false;
        } else {
          field.classList.remove('error');
          if (err) err.textContent = '';
        }
      }

      // Name validation
      const name = document.getElementById('name').value.trim();
      setError('name', 'nameError', name.length < 2 ? 'Please enter your full name.' : '');

      // Phone validation
      const phone = document.getElementById('phone').value.trim();
      const phoneRe = /^[+]?[\d\s\-()]{7,15}$/;
      setError('phone', 'phoneError', !phoneRe.test(phone) ? 'Please enter a valid phone number.' : '');

      // Email validation (optional but if filled, must be valid)
      const email = document.getElementById('email').value.trim();
      if (email) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setError('email', 'emailError', !emailRe.test(email) ? 'Please enter a valid email address.' : '');
      } else {
        setError('email', 'emailError', '');
      }

      if (!valid) return;

      // Simulate submission (replace with real endpoint / EmailJS / Formspree)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

      setTimeout(() => {
        contactForm.hidden = true;
        formSuccess.hidden = false;
      }, 1200);
    });

    // Live clear errors on input
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const errEl = document.getElementById(`${field.id}Error`);
        if (errEl) errEl.textContent = '';
      });
    });
  }

  // ── Footer Year ───────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Scroll-to-top on logo click (hero is #home) ──────────
  document.querySelectorAll('a[href="#home"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ── Smooth scroll for all hash links ─────────────────────
  document.querySelectorAll('a[href^="#"]:not([href="#home"])').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId  = anchor.getAttribute('href').slice(1);
      const targetEl  = document.getElementById(targetId);
      if (!targetEl) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 0;
      const top    = targetEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
