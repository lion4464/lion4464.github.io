(function () {
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');
  const year = document.getElementById('year');
  year.textContent = new Date().getFullYear();

  // Theme (persist)
  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved || (prefersLight ? 'light' : 'dark');
  setTheme(initial);

  themeBtn.addEventListener('click', () => {
    const next = (root.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
  });

  function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    if (mode === 'light') {
      themeIcon.textContent = '☀️';
      themeLabel.textContent = 'Light';
    } else {
      themeIcon.textContent = '🌙';
      themeLabel.textContent = 'Dark';
    }
  }

  // Toast
  const toast = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1400);
  }

  // Copy helpers
  async function copyText(t) {
    try {
      await navigator.clipboard.writeText(t);
      showToast('Copied: ' + t);
    } catch (e) {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = t;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Copied: ' + t);
    }
  }

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => copyText(btn.getAttribute('data-copy')));
  });

  // Dedicated buttons
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  copyEmailBtn?.addEventListener('click', () => copyText(copyEmailBtn.dataset.copy));
  copyPhoneBtn?.addEventListener('click', () => copyText(copyPhoneBtn.dataset.copy));

  // Active nav on scroll
  const navLinks = Array.from(document.querySelectorAll('.nav a'));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const obsNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const id = '#' + entry.target.id;
        const active = navLinks.find(a => a.getAttribute('href') === id);
        active && active.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0.01 });

  sections.forEach(s => obsNav.observe(s));

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const obsReveal = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('show');
        obsReveal.unobserve(en.target);
      }
    });
  }, { threshold: 0.10 });

  revealEls.forEach(el => obsReveal.observe(el));

  // Skills filter
  const skillSearch = document.getElementById('skillSearch');
  const clearSkill = document.getElementById('clearSkill');
  const allChips = Array.from(document.querySelectorAll('.skill-chips .chip'));

  function norm(s) { return (s || '').toLowerCase().trim(); }

  function applyFilter(q) {
    const query = norm(q);
    allChips.forEach(ch => {
      const text = norm(ch.textContent);
      const match = !query || text.includes(query);
      ch.style.opacity = match ? '1' : '.22';
      ch.style.filter = match ? 'none' : 'grayscale(1)';
    });
  }

  skillSearch.addEventListener('input', (e) => applyFilter(e.target.value));
  clearSkill.addEventListener('click', () => {
    skillSearch.value = '';
    applyFilter('');
    skillSearch.focus();
  });

  // Small polish: prevent “#” jump from focusing sticky header too much
  window.addEventListener('hashchange', () => {
    const el = document.querySelector(location.hash);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
})();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.hidden = true;
  navToggle?.setAttribute('aria-expanded', 'false');
}

function openMobileNav() {
  if (!mobileNav) return;
  mobileNav.hidden = false;
  navToggle?.setAttribute('aria-expanded', 'true');
}

navToggle?.addEventListener('click', () => {
  if (!mobileNav) return;
  const isHidden = mobileNav.hidden;
  if (isHidden) openMobileNav();
  else closeMobileNav();
});

// Close after clicking a link
document.querySelectorAll('#mobileNav a').forEach(a => {
  a.addEventListener('click', () => closeMobileNav());
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileNav();
});

// Close if window resized to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 991) closeMobileNav();
});

