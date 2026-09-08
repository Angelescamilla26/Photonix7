/* Photonix 7: pestanas y galeria del inicio. Cargar despues de site.js. */
(() => {
  'use strict';
  const ui = window.PhotonixUI;
  if (!ui) return;

  // Pestañas accesibles: flechas, Inicio/Fin y un único punto de tabulación.
  const tabList = document.getElementById('tech-tabs');
  const tabs = [...tabList.querySelectorAll('[data-tab]')];
  tabList.setAttribute('role', 'tablist');
  function selectTab(index, focus = false) {
    tabs.forEach((tab, position) => {
      const selected = position === index;
      const panel = document.getElementById(tab.dataset.tab);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panel.hidden = !selected;
    });
    if (focus) tabs[index].focus();
    ui.refresh();
  }
  tabs.forEach((tab, index) => {
    const panel = document.getElementById(tab.dataset.tab);
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.tabIndex = 0;
    tab.addEventListener('click', () => selectTab(index));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(next, true);
    });
  });
  selectTab(0);


  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
  const galleryDialog = document.getElementById('gallery-dialog');
  const galleryLinks = [...document.querySelectorAll('[data-gallery]')];
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  let galleryIndex = 0;

  function showImage(index) {
    galleryIndex = (index + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[galleryIndex];
    lightboxImage.src = link.href;
    lightboxImage.alt = link.querySelector('img').alt;
    lightboxCaption.textContent = link.dataset.caption;
    lightboxCounter.textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(galleryLinks.length).padStart(2, '0')}`;
  }
  galleryLinks.forEach((link, index) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      // Mantener la apertura de imágenes en otra pestaña con Ctrl/Cmd o Shift.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showImage(index);
      ui.openDialog(galleryDialog, link);
      lightboxClose.focus();
    });
  });
  lightboxClose.addEventListener('click', () => galleryDialog.close());
  document.getElementById('lightbox-prev').addEventListener('click', () => showImage(galleryIndex - 1));
  document.getElementById('lightbox-next').addEventListener('click', () => showImage(galleryIndex + 1));
  galleryDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(galleryIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
})();
