/**
 * PHOTONIX 7 — TIENDA OFICIAL
 * JavaScript específico para la página de tienda
 * Versión 1.0.0
 */

(() => {
  'use strict';

  // ============================================
  // 1. DETECCIÓN DE PÁGINA (solo ejecutar en tienda.html)
  // ============================================
  const isShopPage = () => {
    const path = window.location.pathname;
    return path.includes('tienda') || path.includes('tienda.html');
  };

  if (!isShopPage()) return; // Salir si no es la página correcta

  // ============================================
  // 2. FILTRO DE PRODUCTOS POR CATEGORÍA
  // ============================================
  const initCategoryFilters = () => {
    const filterButtons = document.querySelectorAll('[data-category]');
    const products = document.querySelectorAll('.product-card');
    
    if (!filterButtons.length || !products.length) return;

    // Función para filtrar
    const filterProducts = (category) => {
      products.forEach(product => {
        const productCategory = product.dataset.category;
        if (category === 'all' || productCategory === category) {
          product.style.display = 'flex';
          // Animación de aparición
          product.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          product.style.display = 'none';
        }
      });
    };

    // Activar botón y desactivar otros
    const setActiveButton = (activeBtn) => {
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      activeBtn.classList.add('active');
    };

    // Event listeners
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = btn.dataset.category;
        setActiveButton(btn);
        filterProducts(category);
      });
    });

    // Inicializar mostrando todos y activando el botón "todos"
    const defaultButton = document.querySelector('[data-category="all"]');
    if (defaultButton) {
      defaultButton.classList.add('active');
    }
  };

  // ============================================
  // 3. CARRITO DE COMPRAS SIMULADO (frontend)
  // ============================================
  const initCart = () => {
    // Crear elementos del carrito si no existen
    if (!document.querySelector('.cart-sidebar')) {
      createCartUI();
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

    // Función para guardar carrito
    const saveCart = () => {
      localStorage.setItem('photonixCart', JSON.stringify(cart));
      updateCartUI();
    };

    // Función para actualizar UI del carrito
    const updateCartUI = () => {
      if (!cartItemsContainer) return;

      // Actualizar contador
      const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
      if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
      }

      // Renderizar items
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty">🛒 Tu carrito está vacío</div>';
        if (cartTotalElement) cartTotalElement.textContent = '0';
        return;
      }

      let html = '';
      let total = 0;

      cart.forEach((item, index) => {
        total += item.price * item.quantity;
        html += `
          <div class="cart-item" data-index="${index}">
            <div class="cart-item-image">${item.icon || '📦'}</div>
            <div class="cart-item-details">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">$${item.price.toLocaleString()}</div>
              <div class="cart-item-quantity">
                <button class="cart-qty-btn minus" data-index="${index}">−</button>
                <span>${item.quantity}</span>
                <button class="cart-qty-btn plus" data-index="${index}">+</button>
              </div>
            </div>
            <button class="cart-item-remove" data-index="${index}">✕</button>
          </div>
        `;
      });

      cartItemsContainer.innerHTML = html;
      if (cartTotalElement) cartTotalElement.textContent = total.toLocaleString();

      // Reasignar eventos a los botones de cantidad/eliminar
      attachCartItemEvents();
    };

    // Función para agregar al carrito
    const addToCart = (productCard) => {
      // Extraer datos del producto
      const name = productCard.querySelector('h3')?.textContent || 'Producto';
      const priceText = productCard.querySelector('.product-price')?.textContent || '$0';
      const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
      const iconSpan = productCard.querySelector('.product-image span');
      const icon = iconSpan ? iconSpan.textContent : '📦';

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          name,
          price,
          icon,
          quantity: 1
        });
      }

      saveCart();
      showNotification(`${name} agregado al carrito`);
    };

    // Eventos para los botones "comprar"
    addToCartButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = btn.closest('.product-card');
        if (productCard) addToCart(productCard);
      });
    });

    // Eventos de cantidad/eliminar (se asignan después de renderizar)
    const attachCartItemEvents = () => {
      document.querySelectorAll('.cart-qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = btn.dataset.index;
          if (index !== undefined) {
            cart[index].quantity += 1;
            saveCart();
          }
        });
      });

      document.querySelectorAll('.cart-qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = btn.dataset.index;
          if (index !== undefined) {
            if (cart[index].quantity > 1) {
              cart[index].quantity -= 1;
            } else {
              cart.splice(index, 1);
            }
            saveCart();
          }
        });
      });

      document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = btn.dataset.index;
          if (index !== undefined) {
            cart.splice(index, 1);
            saveCart();
          }
        });
      });
    };

    // Mostrar/ocultar carrito
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

    // Inicializar UI
    updateCartUI();
  };

  // Función para crear la UI del carrito (sidebar, overlay, toggle)
  const createCartUI = () => {
    const cartHTML = `
      <div class="cart-toggle" aria-label="Abrir carrito">
        <span class="cart-icon">🛒</span>
        <span class="cart-count">0</span>
      </div>
      <div class="cart-overlay"></div>
      <div class="cart-sidebar">
        <div class="cart-header">
          <h3>Tu carrito</h3>
          <button class="cart-close" aria-label="Cerrar carrito">✕</button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span class="cart-total-amount">0</span>
          </div>
          <button class="btn btn-primary checkout-btn" style="width:100%;">Finalizar compra</button>
          <p class="cart-note">Los pagos son simulados (solo frontend)</p>
        </div>
      </div>
    `;

    // Insertar al inicio del body
    document.body.insertAdjacentHTML('afterbegin', cartHTML);

    // Estilos adicionales para el carrito (se agregarán en tienda.css, pero por si acaso)
    const style = document.createElement('style');
    style.textContent = `
      .cart-toggle {
        position: fixed;
        bottom: 3rem;
        right: 3rem;
        width: 6rem;
        height: 6rem;
        background: var(--red-intense);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 9995;
        box-shadow: 0 0.4rem 1.6rem rgba(227,6,19,0.4);
        transition: transform 0.3s ease;
      }
      .cart-toggle:hover {
        transform: scale(1.1);
      }
      .cart-icon {
        font-size: 2.4rem;
      }
      .cart-count {
        position: absolute;
        top: -0.5rem;
        right: -0.5rem;
        background: var(--blue-electric);
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
      .cart-overlay.open {
        opacity: 1;
        visibility: visible;
      }
      .cart-sidebar {
        position: fixed;
        top: 0;
        right: -40rem;
        width: 100%;
        max-width: 40rem;
        height: 100vh;
        background: var(--black-deep);
        border-left: 0.1rem solid rgba(227,6,19,0.2);
        z-index: 9997;
        transition: right 0.4s cubic-bezier(0.23,1,0.32,1);
        display: flex;
        flex-direction: column;
        box-shadow: -0.8rem 0 3.2rem rgba(0,0,0,0.5);
      }
      .cart-sidebar.open {
        right: 0;
      }
      .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2.4rem;
        border-bottom: 0.1rem solid rgba(255,255,255,0.05);
      }
      .cart-header h3 {
        font-size: 2rem;
        margin: 0;
      }
      .cart-close {
        background: transparent;
        border: none;
        color: white;
        font-size: 2.4rem;
        cursor: pointer;
        width: 4rem;
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s;
      }
      .cart-close:hover {
        background: rgba(227,6,19,0.2);
      }
      .cart-items {
        flex: 1;
        overflow-y: auto;
        padding: 2rem;
      }
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
      .cart-item-details {
        flex: 1;
      }
      .cart-item-title {
        font-weight: 600;
        margin-bottom: 0.4rem;
      }
      .cart-item-price {
        color: var(--blue-electric);
        font-weight: 700;
        margin-bottom: 0.8rem;
      }
      .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
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
      .cart-qty-btn:hover {
        background: var(--red-intense);
        border-color: var(--red-intense);
      }
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
      .cart-item-remove:hover {
        color: var(--red-intense);
      }
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
      .cart-total-amount {
        color: var(--blue-electric);
      }
      .checkout-btn {
        margin-bottom: 1rem;
      }
      .cart-note {
        font-size: 1.2rem;
        color: rgba(255,255,255,0.3);
        text-align: center;
      }
    `;
    document.head.appendChild(style);
  };

  // ============================================
  // 4. NOTIFICACIONES FLOTANTES (toast)
  // ============================================
  const showNotification = (message, duration = 3000) => {
    const notification = document.createElement('div');
    notification.className = 'shop-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 10rem;
      right: 3rem;
      background: var(--black-deep);
      color: white;
      padding: 1.2rem 2.4rem;
      border-radius: 4rem;
      border-left: 0.4rem solid var(--red-intense);
      box-shadow: 0 0.8rem 2.4rem rgba(0,0,0,0.5);
      z-index: 10000;
      font-size: 1.4rem;
      opacity: 0;
      transform: translateY(1rem);
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none;
    `;
    document.body.appendChild(notification);

    // Mostrar
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);

    // Ocultar y eliminar
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(1rem)';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  };

  // ============================================
  // 5. ANIMACIÓN DE ENTRADA PARA PRODUCTOS
  // ============================================
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

  // ============================================
  // 6. INICIALIZACIÓN PRINCIPAL
  // ============================================
  const init = () => {
    initCategoryFilters();
    initCart();
    initProductAnimations();

    // Efecto de hover mejorado para imágenes de producto (ya existe en CSS, pero podemos añadir JS)
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

    console.log('Photonix Tienda iniciada');
  };

  if (document.readyState === 'Loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exponer funciones globales (opcional)
  window.PhotonixShop = {
    addToCart: (productCard) => addToCart(productCard),
    filterProducts: (category) => filterProducts(category),
  };
})();