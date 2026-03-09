(function () {
  'use strict';

  const loader = document.getElementById('loader');
  const mainContent = document.querySelector('.main-content');

  const MIN_DISPLAY_TIME = 2600;
  const MAX_DISPLAY_TIME = 6000;

  let startTime = null;
  let hideTimer = null;
  let maxTimer = null;
  let visible = false;

  function showLoader() {
    if (!loader || visible) return;

    visible = true;
    startTime = Date.now();

    loader.style.display = 'flex';
    loader.style.opacity = '1';
    loader.style.transition = 'opacity 0.6s ease';

    // Reactivar animación CSS (por si viene de display:none)
    const traces = loader.querySelectorAll('.trace-flow');
    traces.forEach(t => {
      t.style.animation = 'none';
      t.getBoundingClientRect(); // force reflow
      t.style.animation = '';
    });
  }

  function performHide() {
    if (!visible) return;
    visible = false;

    loader.style.transition =
      'opacity 1.2s cubic-bezier(0.65, 0, 0.35, 1)';
    loader.style.opacity = '0';

    setTimeout(() => {
      loader.style.display = 'none';

      if (mainContent) {
        mainContent.style.display = 'flex';
      }
    }, 1300);

    if (maxTimer) clearTimeout(maxTimer);
  }

  function hideLoader() {
    if (!startTime || hideTimer) return;

    const elapsed = Date.now() - startTime;

    if (elapsed < MIN_DISPLAY_TIME) {
      hideTimer = setTimeout(() => {
        performHide();
        hideTimer = null;
      }, MIN_DISPLAY_TIME - elapsed);
    } else {
      performHide();
    }
  }

  // --- INIT ---
  if (document.readyState === 'Loading') {
    document.addEventListener('DOMContentLoaded', showLoader);
  } else {
    showLoader();
  }

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 50);
  } else {
    window.addEventListener('load', hideLoader);
  }

  maxTimer = setTimeout(hideLoader, MAX_DISPLAY_TIME);

  // Exponer control manual (opcional, pero pro)
  window.ChipLoader = {
    show: showLoader,
    hide: hideLoader
  };
})();
