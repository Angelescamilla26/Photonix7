(() => {
  'use strict';
  const isShopPage = () => {
    const path = window.location.pathname;
    return path.includes('tienda') || path.includes('tienda.blade.php');
  };
  if (!isShopPage()) return;
  const authToggle = document.getElementById('authToggle');
  const userProfile = document.getElementById('userProfile');
  const userNameSpan = document.getElementById('userName');
  const logoutBtn = document.getElementById('logoutBtn');
  const getCsrfToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.content : '';
  };
  const showNotification = (message, type = 'info', duration = 3000) => {
    const notification = document.createElement('div');
    notification.className = `shop-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 10rem;
      right: 3rem;
      background: var(--black-deep);
      color: white;
      padding: 1.2rem 2.4rem;
      border-radius: 4rem;
      border-left: 0.4rem solid ${type === 'success' ? '#00C851' : '#E30613'};
      box-shadow: 0 0.8rem 2.4rem rgba(0,0,0,0.5);
      z-index: 10000;
      font-size: 1.4rem;
      opacity: 0;
      transform: translateY(1rem);
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(1rem)';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  };
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken()
        },
        credentials: 'same-origin'
      });
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        updateUIForAuthenticated(user);
      } else {
        localStorage.removeItem('user');
        updateUIForGuest();
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      updateUIForGuest();
    }
  };
  const updateUIForAuthenticated = (user) => {
    if (!authToggle || !userProfile || !userNameSpan) return;
    userNameSpan.textContent = user.name ? `Hola, ${user.name}` : 'Hola';
    const userEmailSpan = document.getElementById('userEmail');
    if (userEmailSpan && user.email) {
      userEmailSpan.textContent = user.email;
    }
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar && user.name) {
      userAvatar.textContent = user.name.charAt(0).toUpperCase();
    }
    authToggle.style.display = 'none';
    userProfile.style.display = 'flex';
  };
  const updateUIForGuest = () => {
    if (!authToggle || !userProfile) return;
    authToggle.style.display = 'flex';
    userProfile.style.display = 'none';
  };
  const logout = async () => {
    try {
      await fetch('/logout', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': getCsrfToken(),
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('user');
      updateUIForGuest();
      if (userProfile) userProfile.classList.remove('active');
      showNotification('Sesión cerrada correctamente', 'success');
    }
  };
  if (userProfile) {
    userProfile.addEventListener('click', (e) => {
      if (e.target.closest('#logoutBtn')) {
        e.stopPropagation();
        return;
      }
      if (e.target.closest('.user-dropdown')) return;
      userProfile.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!userProfile.contains(e.target)) {
        userProfile.classList.remove('active');
      }
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      logout();
    });
  }
  const initCart = () => {
    if (!document.querySelector('.cart-sidebar')) {
      createCartUI();
    }
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!checkoutBtn) {
      console.warn('No se pudo encontrar el botón de checkout después de crear la UI');
      return;
    }
    const cartToggle = document.querySelector('.cart-toggle');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.cart-close');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.cart-total-amount');
    const cartCountElement = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.product-card .btn-primary');
    let cart = JSON.parse(localStorage.getItem('photonixCart')) || [];
    const saveCart = () => {
      localStorage.setItem('photonixCart', JSON.stringify(cart));
      updateCartUI();
    };
    const updateCartUI = () => {
      if (!cartItemsContainer || !cartTotalElement || !cartCountElement) return;
      cartItemsContainer.innerHTML = '';
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty">Tu carrito está vacío</div>';
        cartTotalElement.textContent = '0';
        cartCountElement.textContent = '0';
        return;
      }
      let total = 0;
      let itemCount = 0;
      cart.forEach((item, index) => {
        total += item.price * item.quantity;
        itemCount += item.quantity;
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
          <div class="cart-item-image">${item.icon || '📦'}</div>
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">$${item.price.toLocaleString()}</div>
            <div class="cart-item-quantity">
              <button class="cart-qty-btn minus" data-index="${index}">−</button>
              <span class="cart-qty">${item.quantity}</span>
              <button class="cart-qty-btn plus" data-index="${index}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-index="${index}" aria-label="Eliminar">✕</button>
        `;
        cartItemsContainer.appendChild(itemElement);
      });
      cartTotalElement.textContent = `$${total.toLocaleString()}`;
      cartCountElement.textContent = itemCount;
    };
    const addToCart = (productCard) => {
      const name = productCard.querySelector('h3')?.textContent || 'Producto';
      const priceText = productCard.querySelector('.product-price')?.textContent || '$0';
      const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
      const iconSpan = productCard.querySelector('.product-image span');
      const icon = iconSpan ? iconSpan.textContent : '📦';
      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, icon, quantity: 1 });
      }
      saveCart();
      showNotification(`${name} agregado al carrito`);
    };
    addToCartButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = btn.closest('.product-card');
        if (productCard) addToCart(productCard);
      });
    });
    if (cartItemsContainer) {
      cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const index = target.dataset.index;
        if (index === undefined) return;
        if (target.classList.contains('plus')) {
          cart[index].quantity += 1;
          saveCart();
        } else if (target.classList.contains('minus')) {
          if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
          } else {
            cart.splice(index, 1);
          }
          saveCart();
        } else if (target.classList.contains('cart-item-remove')) {
          cart.splice(index, 1);
          saveCart();
        }
      });
    }
    checkoutBtn.addEventListener('click', async () => {
      if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'info');
        return;
      }
      try {
        const response = await fetch('/crear-preferencia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken(),
            'Accept': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify({ cart })
        });
        if (!response.ok) {
          const text = await response.text();
          console.error('Respuesta del servidor:', text);
          showNotification('Error del servidor', 'error');
          return;
        }
        const data = await response.json();
        if (data.init_point) {
          window.location.href = data.init_point;
        } else {
          console.error(data);
          showNotification('No se recibió init_point', 'error');
        }
      } catch (error) {
        console.error('Error en checkout:', error);
        showNotification('Error de conexión', 'error');
      }
    });
    if (cartToggle) {
      cartToggle.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open');
      });
    }
    const closeCartFunc = () => {
      cartSidebar.classList.remove('open');
      cartOverlay.classList.remove('open');
    };
    if (closeCart) closeCart.addEventListener('click', closeCartFunc);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartFunc);
    updateCartUI();
  };
  const createCartUI = () => {
    const cartHTML = `
      <div class="cart-toggle" aria-label="Abrir carrito">
        <span class="cart-icon"><i class="fi fi-rs-shopping-cart"></i></span>
        <span class="cart-count">0</span>
      </div>
      <div class="cart-overlay"></div>
      <div class="cart-sidebar">
        <div class="cart-header">
          <h3>Tu carrito</h3>
          <br>
          <br>
          <button class="cart-close" aria-label="Cerrar carrito">✕</button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span class="cart-total-amount">0</span>
          </div>
          <button class="btn btn-primary checkout-btn" style="width:100%;" id="checkout-btn">Finalizar compra</button>
          <p class="cart-note">Pago seguro con Mercado Pago</p>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', cartHTML);
    const style = document.createElement('style');
    style.textContent = `
      .cart-toggle {
        position: fixed;
        bottom: 3rem;
        right: 3rem;
        width: 6rem;
        height: 6rem;
        background: #E30613;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 9995;
        box-shadow: 0 0.4rem 1.6rem rgba(227,6,19,0.4);
        transition: transform 0.3s ease;
      }
      .cart-toggle:hover { transform: scale(1.1); }
      .cart-icon { font-size: 2.4rem; }
      .cart-count {
        position: absolute;
        top: -0.5rem;
        right: -0.5rem;
        background: #0080FF;
        color: white;
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: 700;
      }
      .cart-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(0.4rem);
        z-index: 9996;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }
      .cart-overlay.open { opacity: 1; visibility: visible; }
      .cart-sidebar {
        position: fixed;
        top: 0;
        right: -40rem;
        width: 100%;
        max-width: 40rem;
        height: 100vh;
        background: #0a0a0a;
        border-left: 0.1rem solid rgba(227,6,19,0.2);
        z-index: 9997;
        transition: right 0.4s cubic-bezier(0.23,1,0.32,1);
        display: flex;
        flex-direction: column;
        box-shadow: -0.8rem 0 3.2rem rgba(0,0,0,0.5);
      }
      .cart-sidebar.open { right: 0; }
      .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2.4rem;
        border-bottom: 0.1rem solid rgba(255,255,255,0.05);
      }
      .cart-header h3 { font-size: 2rem; margin: 0; }
      .cart-close {
        background: transparent;
        border: none;
        color: white;
        font-size: 2.4rem;
        cursor: pointer;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        transition: background 0.2s;
      }
      .cart-close:hover { background: rgba(227,6,19,0.2); }
      .cart-items { flex: 1; overflow-y: auto; padding: 2rem; }
      .cart-empty {
        text-align: center;
        color: rgba(255,255,255,0.5);
        padding: 4rem 0;
        font-size: 1.6rem;
      }
      .cart-item {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 0.1rem solid rgba(255,255,255,0.05);
        position: relative;
      }
      .cart-item-image {
        width: 6rem;
        height: 6rem;
        background: rgba(255,255,255,0.03);
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.4rem;
      }
      .cart-item-details { flex: 1; }
      .cart-item-title { font-weight: 600; margin-bottom: 0.4rem; }
      .cart-item-price { color: #0080FF; font-weight: 700; margin-bottom: 0.8rem; }
      .cart-item-quantity { display: flex; align-items: center; gap: 1rem; }
      .cart-qty-btn {
        width: 2.4rem;
        height: 2.4rem;
        border-radius: 50%;
        border: 0.1rem solid rgba(255,255,255,0.2);
        background: transparent;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }
      .cart-qty-btn:hover { background: #E30613; border-color: #E30613; }
      .cart-item-remove {
        position: absolute;
        top: 0;
        right: 0;
        background: transparent;
        border: none;
        color: rgba(255,255,255,0.5);
        font-size: 1.8rem;
        cursor: pointer;
        padding: 0.5rem;
      }
      .cart-item-remove:hover { color: #E30613; }
      .cart-footer {
        padding: 2.4rem;
        border-top: 0.1rem solid rgba(255,255,255,0.05);
        background: rgba(0,0,0,0.3);
      }
      .cart-total {
        display: flex;
        justify-content: space-between;
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 1.6rem;
      }
      .cart-total-amount { color: #0080FF; }
      .checkout-btn { margin-bottom: 1rem; }
      .cart-note { font-size: 1.2rem; color: rgba(255,255,255,0.3); text-align: center; }
    `;
    document.head.appendChild(style);
  };
  const initProductAnimations = () => {
    const products = document.querySelectorAll('.product-card');
    products.forEach((product, index) => {
      product.style.opacity = '0';
      product.style.transform = 'translateY(30px)';
      product.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      setTimeout(() => {
        product.style.opacity = '1';
        product.style.transform = 'translateY(0)';
      }, 100 + index * 50);
    });
  };
  const initImageHover = () => {
    const productImages = document.querySelectorAll('.product-image');
    productImages.forEach(img => {
      img.addEventListener('mousemove', (e) => {
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / 20;
        const deltaY = (y - centerY) / 20;
        img.style.transform = `perspective(500px) rotateX(${-deltaY}deg) rotateY(${deltaX}deg) scale3d(1.05, 1.05, 1.05)`;
      });
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  };
  const initCategoryFilters = () => {
    const filterButtons = document.querySelectorAll('[data-category]');
    const products = document.querySelectorAll('.product-card');
    if (!filterButtons.length || !products.length) return;
    if (!document.querySelector('#shop-filter-animation')) {
      const style = document.createElement('style');
      style.id = 'shop-filter-animation';
      style.textContent = `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
    const filterProducts = (category) => {
      products.forEach(product => {
        const productCategory = product.dataset.category;
        if (category === 'all' || productCategory === category) {
          product.style.display = 'flex';
          product.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          product.style.display = 'none';
        }
      });
    };
    const setActiveButton = (activeBtn) => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      activeBtn.classList.add('active');
    };
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = btn.dataset.category;
        setActiveButton(btn);
        filterProducts(category);
      });
    });
    const defaultButton = document.querySelector('[data-category="all"]');
    if (defaultButton) defaultButton.classList.add('active');
  };
  const init = async () => {
    await checkAuthStatus();
    initCategoryFilters();
    initCart();
    initProductAnimations();
    initImageHover();
    console.log('Photonix Tienda iniciada con autenticación y carrito');
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.PhotonixShop = {
    logout: logout,
    addToCart: (productSelector) => {
      const productCard = productSelector instanceof Element ? productSelector : document.querySelector(productSelector);
      if (!productCard) {
        console.error('Producto no encontrado');
        return;
      }
      const addButton = productCard.querySelector('.btn-primary');
      if (addButton) {
        addButton.click();
      } else {
        const name = productCard.querySelector('h3')?.textContent || 'Producto';
        const priceText = productCard.querySelector('.product-price')?.textContent || '$0';
        const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
        const iconSpan = productCard.querySelector('.product-image span');
        const icon = iconSpan ? iconSpan.textContent : '📦';
        let cart = JSON.parse(localStorage.getItem('photonixCart')) || [];
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ name, price, icon, quantity: 1 });
        }
        localStorage.setItem('photonixCart', JSON.stringify(cart));
        const event = new CustomEvent('cartUpdated');
        window.dispatchEvent(event);
        showNotification(`${name} agregado al carrito`);
      }
    }
  };
})();