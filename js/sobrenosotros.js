/* Photonix 7: filtros del equipo. El contenido existe sin JavaScript. */
(() => {
  'use strict';
  const filters = document.querySelector('.team-filters');
  const cards = [...document.querySelectorAll('[data-team]')];
  const status = document.getElementById('team-status');
  if (!filters || !status || !cards.length) return;
  const buttons = [...filters.querySelectorAll('[data-team-filter]')];
  filters.hidden = false;
  function selectGroup(group, reveal = false) {
    let visible = 0;
    cards.forEach(card => {
      card.hidden = group !== 'all' && card.dataset.team !== group;
      if (!card.hidden) {
        visible++;
        if (reveal) card.classList.add('is-visible');
      }
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.teamFilter === group)));
    status.textContent = visible + (visible === 1 ? ' perfil disponible' : ' perfiles disponibles');
    if (window.PhotonixUI) window.PhotonixUI.refresh();
  }
  buttons.forEach(button => button.addEventListener('click', () => selectGroup(button.dataset.teamFilter, true)));
  selectGroup('all');
})();