/* ─────────────────────────────────────────────────────────────────────────
   WeaveHub Website — main.js
   ───────────────────────────────────────────────────────────────────────── */

// ── FOOTER YEAR ──────────────────────────────────────────────────────────
document.querySelectorAll('#footer-year, .current-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ── NAVBAR SCROLL BEHAVIOUR ───────────────────────────────────────────────
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── HAMBURGER MENU ────────────────────────────────────────────────────────
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────
(function () {
  const targets = document.querySelectorAll(
    '.feature-card, .step-card, .channel-card, .faq-item, .vendor-feature-item, .pp-section, .dash-stat, .stat-item'
  );

  // Add reveal class
  targets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(el => io.observe(el));
  } else {
    // Fallback
    targets.forEach(el => el.classList.add('visible'));
  }
})();

// ── PRIVACY TOC ACTIVE STATE ──────────────────────────────────────────────
(function () {
  const toc = document.getElementById('privacy-toc');
  if (!toc) return;

  const sections = document.querySelectorAll('.pp-section[id]');
  const links    = toc.querySelectorAll('.toc-link');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = toc.querySelector(`[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => io.observe(s));
})();

// ── CONTACT FORM VALIDATION & SUBMISSION ──────────────────────────────────
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    'contact-name':    { error: 'name-error',    msg: 'Please enter your full name.' },
    'contact-email':   { error: 'email-error',   msg: 'Please enter a valid email address.', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    'contact-type':    { error: 'type-error',    msg: 'Please select an issue type.' },
    'contact-subject': { error: 'subject-error', msg: 'Please enter a subject.' },
    'contact-message': { error: 'message-error', msg: 'Please describe your issue.' },
  };

  function showError(fieldId, msg) {
    const el = document.getElementById(fieldId);
    if (el) el.textContent = msg;
    const field = document.getElementById(fieldId.replace('-error', '').replace('name', 'contact-name').replace('email', 'contact-email'));
  }
  function clearErrors() {
    Object.values(fields).forEach(f => {
      const el = document.getElementById(f.error);
      if (el) el.textContent = '';
    });
    document.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
  }

  function validate() {
    let valid = true;
    clearErrors();

    Object.entries(fields).forEach(([id, cfg]) => {
      const input = document.getElementById(id);
      if (!input) return;
      const val = input.value.trim();
      const errEl = document.getElementById(cfg.error);

      let err = '';
      if (!val) { err = cfg.msg; }
      else if (cfg.pattern && !cfg.pattern.test(val)) { err = cfg.msg; }

      if (err) {
        input.classList.add('error');
        if (errEl) errEl.textContent = err;
        valid = false;
      }
    });
    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const btn    = document.getElementById('submit-btn');
    const btnTxt = btn.querySelector('.btn-text');
    const btnLdr = btn.querySelector('.btn-loading');
    const success = document.getElementById('form-success');

    btn.disabled = true;
    btnTxt.style.display = 'none';
    btnLdr.style.display = 'inline';

    // Simulate network request (replace with real API call)
    await new Promise(r => setTimeout(r, 1800));

    btn.disabled = false;
    btnTxt.style.display = 'inline';
    btnLdr.style.display = 'none';

    form.reset();
    clearErrors();
    success.style.display = 'flex';

    setTimeout(() => { success.style.display = 'none'; }, 6000);
  });

  // Live validation on blur
  Object.keys(fields).forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur', () => {
      if (!input.value.trim()) return; // only show error after touching
      const cfg = fields[id];
      const val = input.value.trim();
      const errEl = document.getElementById(cfg.error);
      if (!val || (cfg.pattern && !cfg.pattern.test(val))) {
        input.classList.add('error');
        if (errEl) errEl.textContent = cfg.msg;
      } else {
        input.classList.remove('error');
        if (errEl) errEl.textContent = '';
      }
    });
  });
})();

// ── SMOOTH HASH SCROLL WITH OFFSET ───────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── STAGGERED ANIMATION FOR GRID ITEMS ───────────────────────────────────
(function () {
  document.querySelectorAll('.features-grid, .steps-grid, .channels-grid, .faq-grid').forEach(grid => {
    const children = [...grid.children];
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });
})();
