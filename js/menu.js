(() => {
  'use strict';

  class PhotonixMenu {
    constructor() {
      this.toggleBtn = document.querySelector('.menu-toggle');
      this.menu = document.querySelector('.menu-fullscreen');
      this.closeBtn = document.querySelector('.menu-close');
      this.links = document.querySelectorAll('.menu-link');
      this.body = document.body;
      this.html = document.documentElement;
      this.isOpen = false;
      this.scrollPosition = 0;
      this.originalScrollBehavior = '';
      this.isClosing = false; // Flag para evitar múltiples cierres
      this.init();
    }

    init() {
      if (!this.toggleBtn || !this.menu) return;
      this.bindEvents();
      this.setInitialState();
    }

    setInitialState() {
      this.menu.classList.remove('active');
      this.toggleBtn.classList.remove('active');
      this.isOpen = false;
      this.isClosing = false;
      this.body.style.overflow = '';
      this.body.style.position = '';
      this.body.style.top = '';
      this.body.style.width = '';
    }

    bindEvents() {
      // Toggle button
      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      // Close button
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      // Navigation links
      this.links.forEach(link => {
        link.addEventListener('click', (e) => this.handleLinkClick(e));
      });

      // Escape key
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });

      // Click outside (overlay)
      this.menu.addEventListener('click', (e) => {
        if (e.target === this.menu || e.target.classList.contains('menu-bg-overlay')) {
          this.close();
        }
      });

      // Window resize
      window.addEventListener('resize', this.debounce(() => this.handleResize(), 100));

      // Custom event from other modules
      document.addEventListener('photonix:menuClosed', () => this.forceClose());
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }

    open() {
      if (this.isOpen) return;
      this.isOpen = true;
      this.isClosing = false;

      // Guardar posición exacta del scroll ANTES de cualquier modificación
      this.scrollPosition = window.pageYOffset || window.scrollY || 0;

      // Guardar comportamiento de scroll original y desactivar scroll suave
      this.originalScrollBehavior = this.html.style.scrollBehavior;
      this.html.style.scrollBehavior = 'auto';

      this.menu.classList.add('active');
      this.toggleBtn.classList.add('active');

      // Bloquear scroll del body de forma limpia
      this.body.style.overflow = 'hidden';
      this.body.style.position = 'fixed';
      this.body.style.top = `-${this.scrollPosition}px`;
      this.body.style.left = '0';
      this.body.style.right = '0';
      this.body.style.width = '100%';

      this.animateLinksIn();
      this.emitEvent('menuOpened');
    }

    close() {
      // Evitar múltiples ejecuciones mientras se está cerrando
      if (!this.isOpen || this.isClosing) return;
      this.isClosing = true;
      this.isOpen = false;

      // 1. Remover clases activas inmediatamente
      this.menu.classList.remove('active');
      this.toggleBtn.classList.remove('active');

      // 2. Restaurar estilos del body (liberar scroll)
      this.body.style.overflow = '';
      this.body.style.position = '';
      this.body.style.top = '';
      this.body.style.left = '';
      this.body.style.right = '';
      this.body.style.width = '';

      // 3. Forzar reflow para que los cambios de estilo se apliquen
      void this.body.offsetHeight;

      // 4. Restaurar scroll behavior original
      this.html.style.scrollBehavior = this.originalScrollBehavior;

      // 5. Restaurar la posición del scroll con múltiples estrategias
      const targetScroll = this.scrollPosition;

      // Intentar con scrollTo inmediato (auto)
      window.scrollTo({
        top: targetScroll,
        behavior: 'auto'
      });

      // Fallback para navegadores que no soportan objeto options
      if (window.scrollY !== targetScroll) {
        window.scrollTo(0, targetScroll);
      }

      // Forzar después de un frame por si acaso
      requestAnimationFrame(() => {
        if (window.scrollY !== targetScroll) {
          window.scrollTo(0, targetScroll);
        }
        this.isClosing = false; // Liberar flag solo después de todo
      });

      this.animateLinksOut();
      this.emitEvent('menuClosed');
    }

    forceClose() {
      if (this.isOpen) this.close();
    }

    animateLinksIn() {
      this.links.forEach((link, i) => {
        link.style.transition = `transform 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${i * 0.04}s, opacity 0.4s ease ${i * 0.04}s`;
        link.style.transform = 'translateY(0)';
        link.style.opacity = '1';
      });
    }

    animateLinksOut() {
      this.links.forEach((link, i) => {
        link.style.transition = `transform 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53) ${i * 0.02}s, opacity 0.3s ease ${i * 0.02}s`;
        link.style.transform = 'translateY(2rem)';
        link.style.opacity = '0';
      });
    }

    handleLinkClick(e) {
      const href = e.currentTarget.getAttribute('href');

      if (!href || href === '#') {
        e.preventDefault();
        this.close();
        return;
      }
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          this.close();
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 450);
        }
      }
      else {
        this.close();
      }
    }


    handleResize() {
      if (this.isOpen) {
        this.scrollPosition = window.pageYOffset || window.scrollY || 0;
        this.body.style.top = `-${this.scrollPosition}px`;
      }
    }

    debounce(func, wait) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }

    emitEvent(name) {
      const event = new CustomEvent(`photonix:${name}`, {
        detail: { menu: this, isOpen: this.isOpen }
      });
      document.dispatchEvent(event);
    }
  }

  // Instanciar menú
  const photonixMenu = new PhotonixMenu();
  window.PhotonixMenu = PhotonixMenu;
  window.photonixMenuInstance = photonixMenu;
})();