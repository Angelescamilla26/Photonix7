(() => {
  'use strict';

  const isShopPage = () => window.location.pathname.includes('tienda');
  if (!isShopPage()) return;

  // Elementos DOM
  const authToggle  = document.getElementById('authToggle');
  const userProfile = document.getElementById('userProfile');
  const logoutBtn   = document.getElementById('logoutBtn');

  const getCsrfToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.content : '';
  };

  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str ?? '')));
    return div.innerHTML;
  };

  const showNotification = (message, type = 'info', duration = 3000) => {
    const existing = document.querySelector('.shop-notification');
    if (existing) existing.remove();

    const n = document.createElement('div');
    n.className = `shop-notification ${type}`;
    n.setAttribute('role', 'alert');
    n.setAttribute('aria-live', 'polite');
    n.textContent = message;
    n.style.cssText = [
      'position:fixed',
      'bottom:10rem',
      'right:3rem',
      'background:var(--black-deep)',
      'color:#fff',
      'padding:1.2rem 2.4rem',
      'border-radius:4rem',
      `border-left:0.4rem solid ${type === 'success' ? '#00C851' : '#E30613'}`,
      'box-shadow:0 0.8rem 2.4rem rgba(0,0,0,0.5)',
      'z-index:10000',
      'font-size:1.4rem',
      'opacity:0',
      'transform:translateY(1rem)',
      'transition:opacity 0.3s ease,transform 0.3s ease',
      'pointer-events:none',
    ].join(';');

    document.body.appendChild(n);
    requestAnimationFrame(() => {
      n.style.opacity = '1';
      n.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      n.style.opacity = '0';
      n.style.transform = 'translateY(1rem)';
      setTimeout(() => n.remove(), 300);
    }, duration);
  };
  window.showNotification = showNotification;

  // Autenticación
  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/user', {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': getCsrfToken() },
        credentials: 'same-origin',
      });
      if (res.ok) {
        const user = await res.json();
        updateUIForAuthenticated(user);
      } else {
        updateUIForGuest();
      }
    } catch {
      updateUIForGuest();
    }
  };

  const updateUIForAuthenticated = (user) => {
    if (!authToggle || !userProfile) return;
    const nameSpan   = document.getElementById('userName');
    const emailSpan  = document.getElementById('userEmail');
    const avatarEl   = document.getElementById('userAvatar');
    if (nameSpan)  nameSpan.textContent  = user.name ? `Hola, ${escapeHtml(user.name)}` : 'Hola';
    if (emailSpan) emailSpan.textContent = user.email ? escapeHtml(user.email) : '';
    if (avatarEl && user.name) avatarEl.textContent = user.name.charAt(0).toUpperCase();
    authToggle.style.display  = 'none';
    userProfile.style.display = 'flex';
  };

  const updateUIForGuest = () => {
    if (!authToggle || !userProfile) return;
    authToggle.style.display  = 'flex';
    userProfile.style.display = 'none';
  };

  const logout = async () => {
    try {
      await fetch('/logout', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': getCsrfToken(), 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      });
    } catch { }
    updateUIForGuest();
    if (userProfile) userProfile.classList.remove('active');
    showNotification('Sesión cerrada correctamente', 'success');
  };

  if (userProfile) {
    userProfile.addEventListener('click', (e) => {
      if (e.target.closest('#logoutBtn') || e.target.closest('.user-dropdown')) return;
      userProfile.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (userProfile && !userProfile.contains(e.target)) {
        userProfile.classList.remove('active');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') userProfile.classList.remove('active');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      logout();
    });
  }

  // Carrito
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('photonixCart')) || [];
    if (!Array.isArray(cart)) cart = [];
    // Eliminar productos que no tengan id (por si quedaron de versiones anteriores)
    cart = cart.filter(item => item.id !== undefined);
    if (cart.length === 0) localStorage.removeItem('photonixCart');
  } catch { cart = []; }

  const saveCart = () => {
    localStorage.setItem('photonixCart', JSON.stringify(cart));
    updateCartUI();
  };

  const updateCartUI = () => {
    const container = document.getElementById('cartItems');
    const totalEl   = document.getElementById('cartTotal');
    const countEl   = document.querySelector('.cart-count');
    if (!container || !totalEl || !countEl) return;

    container.innerHTML = '';

    if (cart.length === 0) {
      container.innerHTML = '<div class="cart-empty">Tu carrito está vacío</div>';
      totalEl.textContent = '$0';
      countEl.textContent = '0';
      return;
    }

    let total = 0, itemCount = 0;
    cart.forEach((item, index) => {
      total      += item.price * item.quantity;
      itemCount  += item.quantity;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';

      const imgContent = item.image
        ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" style="width:100%;height:100%;object-fit:cover;">`
        : '📦';

      itemEl.innerHTML = `
        <div class="cart-item-image">${imgContent}</div>
        <div class="cart-item-details">
          <div class="cart-item-title">${escapeHtml(item.name)}</div>
          <div class="cart-item-price">$${Number(item.price).toLocaleString()}</div>
          <div class="cart-item-quantity">
            <button class="cart-qty-btn minus" data-index="${index}" type="button" aria-label="Reducir cantidad">−</button>
            <span class="cart-qty" aria-label="Cantidad: ${item.quantity}">${item.quantity}</span>
            <button class="cart-qty-btn plus"  data-index="${index}" type="button" aria-label="Aumentar cantidad">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-index="${index}" type="button" aria-label="Eliminar ${escapeHtml(item.name)}">✕</button>
      `;
      container.appendChild(itemEl);
    });

    totalEl.textContent = `$${total.toLocaleString()}`;
    countEl.textContent = itemCount;
  };
  window.updateCartUI = updateCartUI;

  const handleAddToCart = (e) => {
    e.preventDefault();
    const card = e.currentTarget.closest('.product-card');
    if (!card) return;

    const id   = card.dataset.id;                       // ✅ ID desde el atributo
    const name = card.querySelector('h3')?.textContent?.trim() || 'Producto';
    const priceText = card.querySelector('.product-price')?.textContent || '0';
    const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;
    const img  = card.querySelector('.product-image img');
    const image = img?.src || null;

    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, image, quantity: 1 });
    }
    saveCart();
    showNotification(`${escapeHtml(name)} agregado al carrito`, 'success');
  };

  const initCartButtons = () => {
    document.querySelectorAll('.product-card .btn-primary').forEach(btn => {
      btn.removeEventListener('click', handleAddToCart);
      btn.addEventListener('click', handleAddToCart);
    });
  };

  const initCart = () => {
    const cartToggle  = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart   = document.getElementById('cartClose');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartItems   = document.getElementById('cartItems');

    if (!cartSidebar) return;

    const openCart  = () => { cartSidebar.classList.add('open'); cartOverlay?.classList.add('open'); cartSidebar.setAttribute('aria-hidden', 'false'); };
    const closeCartFn = () => { cartSidebar.classList.remove('open'); cartOverlay?.classList.remove('open'); cartSidebar.setAttribute('aria-hidden', 'true'); };

    if (cartToggle)  cartToggle.addEventListener('click', openCart);
    if (closeCart)   closeCart.addEventListener('click', closeCartFn);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartFn);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cartSidebar.classList.contains('open')) closeCartFn();
    });

    if (cartItems) {
      cartItems.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-index]');
        if (!btn) return;
        const index = parseInt(btn.dataset.index, 10);
        if (isNaN(index) || index < 0 || index >= cart.length) return;

        if (btn.classList.contains('plus')) {
          cart[index].quantity += 1;
        } else if (btn.classList.contains('minus')) {
          cart[index].quantity > 1 ? cart[index].quantity -= 1 : cart.splice(index, 1);
        } else if (btn.classList.contains('cart-item-remove')) {
          cart.splice(index, 1);
        }
        saveCart();
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', async () => {
        if (cart.length === 0) { showNotification('Tu carrito está vacío', 'info'); return; }
        try {
          const res = await fetch('/crear-preferencia', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': getCsrfToken(),
              'Accept': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ cart }),
          });
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            showNotification(errorData.error || 'Error del servidor', 'error');
            return;
          }
          const data = await res.json();
          if (data.init_point) {
            window.location.href = data.init_point;
          } else {
            showNotification('No se recibió init_point', 'error');
          }
        } catch {
          showNotification('Error de conexión', 'error');
        }
      });
    }

    updateCartUI();
  };

  // Productos
  const loadProducts = async () => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    try {
      const res = await fetch('/api/productos', {
        headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': getCsrfToken() },
      });
      if (!res.ok) throw new Error('Error al cargar productos');
      const productos = await res.json();
      renderProducts(productos);
    } catch {
      if (grid) grid.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:4rem;">No se pudieron cargar los productos.</p>';
    }
  };

  const renderProducts = (productos) => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';

    productos.forEach(producto => {
      const categoria   = escapeHtml(producto.category || 'accesorios');
      const nombre      = escapeHtml(producto.name    || '');
      const descripcion = escapeHtml(producto.description || '');
      const precioNum   = Number(producto.price) || 0;
      const precioFormato = `$ ${precioNum.toLocaleString()}`;

      let imagenUrl = '';
      if (producto.image_url) {
        try {
          const parsed = new URL(producto.image_url, window.location.origin);
          if (parsed.origin === window.location.origin || parsed.protocol === 'https:') {
            imagenUrl = parsed.href;
          }
        } catch { imagenUrl = ''; }
      }

      const card = document.createElement('div');
      card.className = 'design-item product-card reveal';
      card.dataset.id = producto.id;          // ✅ ID del producto
      card.dataset.category = categoria;
      card.setAttribute('role', 'listitem');

      const imgTag = imagenUrl
        ? `<img src="${escapeHtml(imagenUrl)}" alt="${nombre}" loading="lazy">`
        : `<div class="product-placeholder" aria-hidden="true">📦</div>`;

      card.innerHTML = `
        <div class="product-image">${imgTag}</div>
        <h3>${nombre}</h3>
        <span class="product-price">${precioFormato}</span>
        <p>${descripcion}</p>
        <button class="btn btn-primary" type="button">
          <i class="fas fa-shopping-cart" aria-hidden="true"></i> <span>comprar</span>
        </button>
      `;
      grid.appendChild(card);
    });

    initCartButtons();
    initProductAnimations();
    filterProducts(getActiveCategory());
  };

  const getActiveCategory = () => document.querySelector('.category-btn.active')?.dataset.category || 'all';

  const filterProducts = (category) => {
    document.querySelectorAll('.product-card').forEach(card => {
      const show = category === 'all' || card.dataset.category === category;
      card.style.display = show ? 'flex' : 'none';
    });
  };

  const initCategoryFilters = () => {
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterProducts(btn.dataset.category);
      });
    });
  };

  const initProductAnimations = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('.product-card').forEach((card, i) => {
      if (prefersReduced) { card.style.opacity = '1'; return; }
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100 + i * 50);
    });
  };

  const initImageHover = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    document.querySelectorAll('.product-image').forEach(img => {
      img.addEventListener('mousemove', (e) => {
        const r = img.getBoundingClientRect();
        const dx = ((e.clientX - r.left) - r.width  / 2) / 20;
        const dy = ((e.clientY - r.top)  - r.height / 2) / 20;
        img.style.transform = `perspective(500px) rotateX(${-dy}deg) rotateY(${dx}deg) scale3d(1.05,1.05,1.05)`;
      });
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'perspective(500px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });
  };

  const initHeroSlider = () => {
    const track = document.getElementById('heroSliderTrack');
    if (!track) return;
    const slides = Array.from(track.children);
    if (slides.length <= 1) return;

    let current = 0, moving = false, timer = null;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const goTo = (index) => {
      if (moving) return;
      moving = true;
      current = index;
      track.style.transform = `translateX(${-current * 100}%)`;
      document.querySelectorAll('.hero-slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
      setTimeout(() => { moving = false; }, 1200);
    };

    const next = () => goTo((current + 1) % slides.length);
    const stop = () => { if (timer) clearInterval(timer); };
    const start = () => { stop(); if (!prefersReduced) timer = setInterval(next, 5000); };

    const hero = document.querySelector('#shop-hero');
    const dotsEl = document.createElement('div');
    dotsEl.className = 'hero-slider-dots';
    dotsEl.setAttribute('role', 'tablist');
    dotsEl.setAttribute('aria-label', 'Diapositivas del banner');
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'hero-slider-dot';
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Diapositiva ${i + 1}`);
      dot.addEventListener('click', () => { stop(); goTo(i); start(); });
      dotsEl.appendChild(dot);
    });
    hero?.appendChild(dotsEl);

    goTo(0);
    start();

    if (hero) {
      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
    }
  };

  const initReveal = () => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = entry.target.dataset.delay;
        if (delay) entry.target.style.transitionDelay = (parseInt(delay, 10) / 1000) + 's';
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  };

  const init = async () => {
    initReveal();
    initHeroSlider();
    initCategoryFilters();
    initCart();
    await checkAuthStatus();
    await loadProducts();
    initImageHover();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.PhotonixShop = {
    logout,
    cart: { get: () => [...cart], clear: () => { cart = []; saveCart(); } },
  };
})();