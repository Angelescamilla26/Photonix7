(function () {
  'use strict';

  const MIN_DISPLAY_MS = 2600;  
  const MAX_DISPLAY_MS = 6000;  

  const loader = document.getElementById('loader');

  if (!loader) return;

  const startTime = Date.now();
  let hideScheduled = false;
  let maxTimer = null;

  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  function performHide() {
    if (maxTimer) {
      clearTimeout(maxTimer);
      maxTimer = null;
    }

    loader.classList.add('loader-hiding');

    if (prefersReduced) {

      loader.style.display = 'none';
      return;
    }

    loader.style.transition = 'opacity 1.2s cubic-bezier(0.65, 0, 0.35, 1)';
    loader.style.opacity    = '0';

    setTimeout(() => {
      loader.style.display = 'none';

      loader.querySelectorAll('.trace-flow').forEach(el => {
        el.style.animationPlayState = 'paused';
      });
    }, 1300);
  }

  function scheduleHide() {
    if (hideScheduled) return;
    hideScheduled = true;

    const elapsed   = Date.now() - startTime;
    const remaining = MIN_DISPLAY_MS - elapsed;

    if (remaining > 0) {
      setTimeout(performHide, remaining);
    } else {
      performHide();
    }
  }

  if (document.readyState === 'complete') {

    scheduleHide();
  } else {

    window.addEventListener('load', scheduleHide, { once: true });
  }

  maxTimer = setTimeout(scheduleHide, MAX_DISPLAY_MS);

  window.ChipLoader = {
    hide: performHide,

    setMinTime: (ms) => {  },
  };

})();