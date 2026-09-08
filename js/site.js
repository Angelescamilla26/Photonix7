/* Photonix 7: navegacion, animaciones y dialogos compartidos. */
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.getElementById('site-header');
  const progress = document.getElementById('reading-progress');
  const navLinks = [...document.querySelectorAll('[data-section]')];
  const navSections = navLinks.map(link => document.getElementById(link.dataset.section));
  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();

  // Un único ciclo por frame actualiza la cabecera, el progreso y la sección activa.
  let scrollFrame = 0;
  function updateScroll() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', scrollY > 24);
    progress.style.transform = `scaleX(${maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0})`;

    let active = -1;
    const threshold = header.offsetHeight + Math.min(window.innerHeight * .22, 180);
    navSections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= threshold) active = index;
    });
    navLinks.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollFrame = 0;
  }
  function scheduleScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  window.addEventListener('load', scheduleScroll, { once: true });
  updateScroll();

  // Sin JS o sin IntersectionObserver, el contenido y las cifras ya son visibles.
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(element => {
      // No ocultar contenido ya visible ni el destino de un enlace profundo.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      revealObserver.observe(element);
      element.classList.add('reveal-ready');
    });

    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);
        const element = entry.target;
        const target = Number(element.dataset.count);
        if (!Number.isFinite(target)) return;
        const started = performance.now();
        const label = element.textContent;
        element.setAttribute('aria-label', label);
        function animate(now) {
          const elapsed = reducedMotion.matches ? 1 : Math.min((now - started) / 1100, 1);
          element.textContent = Math.round(target * (1 - Math.pow(1 - elapsed, 3)));
          if (elapsed < 1) requestAnimationFrame(animate);
          else element.textContent = label;
        }
        requestAnimationFrame(animate);
      });
    }, { threshold: .8 });
    document.querySelectorAll('[data-count]').forEach(element => counterObserver.observe(element));

    reducedMotion.addEventListener('change', event => {
      if (!event.matches) return;
      revealObserver.disconnect();
      counterObserver.disconnect();
      document.querySelectorAll('.reveal-ready').forEach(element => element.classList.add('is-visible'));
    });
  }


  window.addEventListener('photonix:layout', scheduleScroll);
  document.addEventListener('toggle', scheduleScroll, true);
  const supportsDialog = typeof HTMLDialogElement !== 'undefined' && !!HTMLDialogElement.prototype.showModal;
  const triggers = new WeakMap();
  function openDialog(dialog, trigger) {
    if (!supportsDialog || !dialog || dialog.open) return false;
    triggers.set(dialog, trigger);
    dialog.showModal();
    document.body.classList.add('dialog-open');
    return true;
  }
  window.PhotonixUI = Object.freeze({ openDialog, refresh: scheduleScroll });
  if (!supportsDialog) return;
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.toggle('dialog-open', !!document.querySelector('dialog[open]'));
      const trigger = triggers.get(dialog);
      if (trigger && trigger.getClientRects().length) trigger.focus({ preventScroll: true });
      triggers.delete(dialog);
      scheduleScroll();
    });
  });
  const menu = document.getElementById('mobile-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  if (!menu || !menuToggle || !menuClose) return;
  document.documentElement.classList.add('has-dialogs');
  menuToggle.hidden = false;
  menuToggle.addEventListener('click', () => {
    if (!openDialog(menu, menuToggle)) return;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuClose.focus();
  });
  menuClose.addEventListener('click', () => menu.close());
  menu.addEventListener('close', () => menuToggle.setAttribute('aria-expanded', 'false'));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches && menu.open) menu.close();
  });
})();
