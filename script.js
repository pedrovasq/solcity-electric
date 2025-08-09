document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    const closeNav = () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    const openNav = () => {
      navMenu.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
    };
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close when clicking outside menu
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!navMenu.classList.contains('is-open')) return;
      if (navMenu.contains(target) || navToggle.contains(target)) return;
      closeNav();
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
    // Close after clicking a link
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeNav());
    });
  }

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
  let lastFocus = null;

  function openLightbox(src, captionText) {
    if (!lightbox || !lightboxImg || !lightboxClose) return;
    lastFocus = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = captionText || '';
    if (lightboxCaption) lightboxCaption.textContent = captionText || '';
    lightbox.removeAttribute('hidden');
    lightboxClose.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute('hidden', '');
    lightboxImg && (lightboxImg.src = '');
    if (lightboxCaption) lightboxCaption.textContent = '';
    document.removeEventListener('keydown', onKeydown);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  document.querySelectorAll('.gallery-item').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href');
      const img = a.querySelector('img');
      const caption = a.getAttribute('data-caption') || img?.getAttribute('alt') || '';
      if (href) openLightbox(href, caption);
    });
  });

  // Optional: fetch social icons from Simple Icons CDN
  const enableIconFetch = false; // set to true to attempt fetching icons
  if (enableIconFetch) {
    const icons = document.querySelectorAll('.social .icon[data-icon-name]');
    icons.forEach(async (el) => {
      const name = el.getAttribute('data-icon-name');
      if (!name) return;
      const url = `https://cdn.jsdelivr.net/npm/simple-icons@11/icons/${name}.svg`;
      try {
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) return;
        const svg = await res.text();
        el.innerHTML = svg;
        el.classList.add('has-svg');
      } catch (e) {
        // Silently fall back to placeholder initials
      }
    });
  }

  // Back to top button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    const toggleBackToTop = () => {
      const threshold = 280;
      if (window.scrollY > threshold) {
        backToTop.classList.add('show');
        backToTop.removeAttribute('hidden');
      } else {
        backToTop.classList.remove('show');
        backToTop.setAttribute('hidden', '');
      }
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }
});
