/* Catálogo Photonix 7: búsqueda, categorías y ordenación local. */
(() => {
  'use strict';

  const controls = document.getElementById('catalog-controls');
  const grid = document.getElementById('product-grid');
  const search = document.getElementById('product-search');
  const sort = document.getElementById('product-sort');
  const status = document.getElementById('catalog-status');
  const empty = document.getElementById('catalog-empty');
  const clearSearch = document.getElementById('clear-search');
  const resetFilters = document.getElementById('reset-filters');
  const emptyReset = document.getElementById('empty-reset');
  if (!controls || !grid || !search || !sort || !status || !empty || !clearSearch || !resetFilters || !emptyReset) return;

  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es-MX').trim();
  const buttons = [...controls.querySelectorAll('[data-filter]')];
  const products = [...grid.querySelectorAll('[data-product]')].map((card, index) => ({
    card,
    index,
    name: card.querySelector('h3').textContent.trim(),
    category: card.dataset.category,
    price: Number(card.dataset.price),
    searchText: normalize(
      card.querySelector('h3').textContent + ' ' +
      card.querySelector('.product-description').textContent + ' ' +
      card.querySelector('.product-category').textContent
    )
  }));
  const categories = new Set(buttons.map(button => button.dataset.filter));
  let category = 'all';
  let currentSort = 'featured';

  function applyFilters() {
    const terms = normalize(search.value).split(/\s+/).filter(Boolean);
    const sortOrder = sort.value;
    if (sortOrder !== currentSort) {
      const sorted = [...products].sort((first, second) => {
        if (sortOrder === 'price-asc') return first.price - second.price || first.index - second.index;
        if (sortOrder === 'price-desc') return second.price - first.price || first.index - second.index;
        if (sortOrder === 'name') return first.name.localeCompare(second.name, 'es', { sensitivity: 'base' }) || first.index - second.index;
        return first.index - second.index;
      });
      sorted.forEach(product => grid.appendChild(product.card));
      currentSort = sortOrder;
    }

    let visible = 0;
    products.forEach(product => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesSearch = terms.every(term => product.searchText.includes(term));
      product.card.hidden = !(matchesCategory && matchesSearch);
      if (!product.card.hidden) visible++;
    });

    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    status.textContent = visible === products.length
      ? visible + (visible === 1 ? ' producto' : ' productos')
      : visible + ' de ' + products.length + ' productos';
    empty.hidden = visible !== 0;
    clearSearch.hidden = search.value.length === 0;
    resetFilters.hidden = category === 'all' && terms.length === 0 && sort.value === 'featured';
    if (window.PhotonixUI) window.PhotonixUI.refresh();
  }

  function reset() {
    category = 'all';
    search.value = '';
    sort.value = 'featured';
    applyFilters();
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      category = button.dataset.filter;
      applyFilters();
    });
  });
  search.addEventListener('input', applyFilters);
  sort.addEventListener('change', applyFilters);
  clearSearch.addEventListener('click', () => {
    search.value = '';
    applyFilters();
    search.focus({ preventScroll: true });
  });
  resetFilters.addEventListener('click', () => {
    reset();
    search.focus({ preventScroll: true });
  });
  emptyReset.addEventListener('click', () => {
    reset();
    search.focus({ preventScroll: true });
  });

  // Los enlaces siguen llevando al catálogo cuando JavaScript está desactivado.
  document.querySelectorAll('[data-filter-link]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const selected = link.dataset.filterLink;
      if (!categories.has(selected)) return;
      category = selected;
      search.value = '';
      applyFilters();
    });
  });

  controls.hidden = false;
  applyFilters();
})();
