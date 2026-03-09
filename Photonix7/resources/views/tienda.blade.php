<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Photonix 7 — Tienda oficial</title>
  <meta name="description" content="Equipamiento, componentes y merchandising del equipo Photonix 7. Todo para los amantes de la movilidad eléctrica.">
  <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
  <link rel="stylesheet" href="{{ asset('css/tienda.css') }}">
  <link rel="stylesheet" href="{{ asset('css/loader.css') }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-regular-straight/css/uicons-regular-straight.css'>
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <style>
    html {
      font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
  </style>
</head>
<body>
  <div class="main-container" id="loader">
    <div class="loader">
      <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2d2d2d" />
            <stop offset="100%" stop-color="#0f0f0f" />
          </linearGradient>
          <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#eeeeee" />
            <stop offset="100%" stop-color="#888888" />
          </linearGradient>
          <linearGradient id="pinGradient" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stop-color="#bbbbbb" />
            <stop offset="50%" stop-color="#888888" />
            <stop offset="100%" stop-color="#555555" />
          </linearGradient>
        </defs>
        <g id="traces">
          <path d="M100 100 H200 V210 H326" class="trace-bg" />
          <path d="M100 100 H200 V210 H326" class="trace-flow purple" />
          <path d="M80 180 H180 V230 H326" class="trace-bg" />
          <path d="M80 180 H180 V230 H326" class="trace-flow blue" />
          <path d="M60 260 H150 V250 H326" class="trace-bg" />
          <path d="M60 260 H150 V250 H326" class="trace-flow yellow" />
          <path d="M100 350 H200 V270 H326" class="trace-bg" />
          <path d="M100 350 H200 V270 H326" class="trace-flow green" />
          <path d="M700 90 H560 V210 H474" class="trace-bg" />
          <path d="M700 90 H560 V210 H474" class="trace-flow blue" />
          <path d="M740 160 H580 V230 H474" class="trace-bg" />
          <path d="M740 160 H580 V230 H474" class="trace-flow green" />
          <path d="M720 250 H590 V250 H474" class="trace-bg" />
          <path d="M720 250 H590 V250 H474" class="trace-flow red" />
          <path d="M680 340 H570 V270 H474" class="trace-bg" />
          <path d="M680 340 H570 V270 H474" class="trace-flow yellow" />
        </g>
        <rect x="330" y="190" width="140" height="100" rx="20" ry="20" fill="url(#chipGradient)" stroke="#222" stroke-width="3" filter="drop-shadow(0 0 6px rgba(0,0,0,0.8))" />
        <g>
          <rect x="322" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2" />
          <rect x="322" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2" />
          <rect x="322" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2" />
          <rect x="322" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2" />
        </g>
        <g>
          <rect x="470" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2" />
          <rect x="470" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2" />
          <rect x="470" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2" />
          <rect x="470" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2" />
        </g>
        <text x="400" y="240" font-family="Arial, sans-serif" font-size="22" fill="url(#textGradient)" text-anchor="middle" alignment-baseline="middle">Loading</text>
        <circle cx="100" cy="100" r="5" fill="black" />
        <circle cx="80" cy="180" r="5" fill="black" />
        <circle cx="60" cy="260" r="5" fill="black" />
        <circle cx="100" cy="350" r="5" fill="black" />
        <circle cx="700" cy="90" r="5" fill="black" />
        <circle cx="740" cy="160" r="5" fill="black" />
        <circle cx="720" cy="250" r="5" fill="black" />
        <circle cx="680" cy="340" r="5" fill="black" />
      </svg>
    </div>
  </div>
  <div class="cursor"></div>
  <div class="cursor-follower"></div>
  <div class="menu-toggle">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <a href="{{ route('login') }}" class="auth-toggle" id="authToggle">
    <i class="fas fa-user"></i> Acceder / Registrarse
  </a>
  <div class="user-profile" id="userProfile" style="display: none;">
    <div class="user-info">
      <div class="user-avatar" id="userAvatar">U</div>
      <div class="user-details">
        <span class="user-name" id="userName"></span>
        <span class="user-email" id="userEmail"></span>
      </div>
    </div>
    <div class="user-dropdown" id="userDropdown">
      <a href="{{ route('dashboard') }}" class="dropdown-item" data-action="profile">
        <i class="fas fa-user"></i> Mi perfil
      </a>
      <a href="#" class="dropdown-item" data-action="orders">
        <i class="fas fa-shopping-bag"></i> Mis pedidos
      </a>
      <div class="dropdown-divider"></div>
      <button class="dropdown-item" id="logoutBtn">
        <i class="fas fa-sign-out-alt"></i> Cerrar sesión
      </button>
    </div>
  </div>
  <div class="menu-fullscreen">
    <div class="menu-bg-overlay"></div>
    <div class="menu-container">
      <nav>
        <ul>
          <li><a href="{{ route('welcome') }}" class="menu-link"><span class="menu-index">00</span> inicio</a></li>
          <li><a href="{{ route('nosotros') }}" class="menu-link"><span class="menu-index">01</span> sobre nosotros</a></li>
          <li><a href="{{ route('tienda') }}" class="menu-link"><span class="menu-index">02</span> tienda</a></li>
          <li><a href="{{ route('welcome') }}#design" class="menu-link"><span class="menu-index">03</span> diseño</a></li>
          <li><a href="{{ route('welcome') }}#engineering" class="menu-link"><span class="menu-index">04</span> ingeniería</a></li>
          <li><a href="{{ route('welcome') }}#performance" class="menu-link"><span class="menu-index">05</span> rendimiento</a></li>
          <li><a href="{{ route('welcome') }}#safety" class="menu-link"><span class="menu-index">06</span> seguridad</a></li>
          <li><a href="{{ route('welcome') }}#gallery" class="menu-link"><span class="menu-index">07</span> galería</a></li>
          <li><a href="{{ route('welcome') }}#driving" class="menu-link"><span class="menu-index">08</span> conducción</a></li>
          <li><a href="{{ route('welcome') }}#vision" class="menu-link"><span class="menu-index">09</span> visión</a></li>
        </ul>
      </nav>
      <div class="menu-footer">
        <p>© 2026 Photonix 7 — Universidad Politécnica de Pénjamo</p>
        <div class="menu-social">
          <span>IG</span>
          <span>FB</span>
          <span>YT</span>
        </div>
      </div>
    </div>
  </div>
  <main>
    <section id="shop-hero" class="hero fullscreen" style="height: 100vh; min-height: 50rem;">
      <div class="hero-slider-container">
        <div class="hero-media">
          <div class="hero-slider-track" id="heroSliderTrack">
            <div class="hero-slide" style="background-image: url('{{ asset('img/banners/banner1.jpeg') }}');"></div>
            <div class="hero-slide" style="background-image: url('{{ asset('img/banners/banner2.jpeg') }}');"></div>
            <div class="hero-slide" style="background-image: url('{{ asset('img/banners/banner3.jpeg') }}');"></div>
            <div class="hero-slide" style="background-image: url('{{ asset('img/banners/banner4.jpeg') }}');"></div>
          </div>
        </div>
      </div>
      <div class="hero-bg-layer" style="background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 100%);"></div>
      <div class="hero-particles"></div>
      <div class="hero-grid-overlay"></div>
      <div class="hero-container">
        <div class="hero-badge reveal">
          <span><i class="fas fa-store"></i> photonix 7 · store</span>
        </div>
        <h1 class="hero-title reveal" style="font-size: clamp(4rem, 10vw, 8rem);">
          <span class="title-line">Tienda oficial</span>
          <span class="title-line title-small">equipamiento · componentes · estilo</span>
        </h1>
        <p class="hero-description reveal">
          Descubre productos exclusivos diseñados para llevar la experiencia Photonix al siguiente nivel.
          Desde componentes de alto rendimiento hasta merchandising de edición limitada.
        </p>
        <div class="hero-cta reveal">
          <a href="#products" class="btn btn-primary"><i class="fas fa-shopping-bag"></i> ver productos</a>
          <a href="{{ route('welcome') }}" class="btn btn-outline"><i class="fas fa-arrow-left"></i> volver al inicio</a>
        </div>
      </div>
    </section>
    <br>
    <br>
    <section class="design" style="padding: 4rem 0 2rem; background: var(--black-deep);">
      <div class="section-container category-filters">
        <span class="section-tag" style="padding-left: 0; margin: 0;"><i class="fas fa-filter"></i> categorías</span>
        <button class="category-btn active" data-category="all">todos</button>
        <button class="category-btn" data-category="ropa"><i class="fas fa-tshirt"></i> ropa</button>
        <button class="category-btn" data-category="accesorios"><i class="fas fa-key"></i> accesorios</button>
        <button class="category-btn" data-category="componentes"><i class="fas fa-microchip"></i> componentes</button>
      </div>
    </section>
    <section id="products" class="design" style="background: var(--black);">
      <div class="section-container">
        <div class="design-header">
          <h2>selección photonix</h2>
        </div>
        <div class="design-grid" style="grid-template-columns: repeat(3, 1fr); gap: 3rem;" id="product-grid">
          <div class="design-item product-card reveal" data-category="ropa">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Camiseta Photonix 7">
            </div>
            <h3>Camiseta Photonix 7</h3>
            <span class="product-price">$ 270</span>
            <p>Playera tipo polo personalizable.</p>
            <button class="btn btn-primary"><i class="fas fa-shopping-cart"></i> comprar</button>
          </div>
          <div class="design-item product-card reveal" data-category="ropa">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1575425192969-5fbf3b2f49fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Gorra negra Photonix">
            </div>
            <h3>Gorra negra Photonix</h3>
            <span class="product-price">$ 299</span>
            <p>Ajustable, con parche de velcro intercambiable.</p>
            <button class="btn btn-primary"><i class="fas fa-shopping-cart"></i> comprar</button>
          </div>
          <div class="design-item product-card reveal" data-category="accesorios">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1604165851071-97cc7372c9a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Llavero metálico">
            </div>
            <h3>Llavero metálico</h3>
            <span class="product-price">$ 149</span>
            <p>Acero inoxidable, grabado láser del logotipo.</p>
            <button class="btn btn-primary"><i class="fas fa-shopping-cart"></i> comprar</button>
          </div>
          <div class="design-item product-card reveal" data-category="ropa">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1581092335871-4e7c3e3d6b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Kit sensor de corriente">
            </div>
            <h3>Playera casual</h3>
            <span class="product-price">$ 220</span>
            <p>Playera casual personalizable.</p>
            <button class="btn btn-primary"><i class="fas fa-shopping-cart"></i> comprar</button>
          </div>
          <div class="design-item product-card reveal" data-category="componentes">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1600712242805-5f78671b24da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Amortiguador coilover">
            </div>
            <h3>Amortiguador coilover</h3>
            <span class="product-price">$ 2,890</span>
            <p>Modelo JLA-07-003, suspensión delantera.</p>
            <button class="btn btn-primary"><i class="fas fa-shopping-cart"></i> comprar</button>
          </div>
          <div class="design-item product-card reveal" data-category="componentes">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Display UKC1">
            </div>
            <h3>Display UKC1</h3>
            <span class="product-price">$ 1,507</span>
            <p>Pantalla LCD a color 3.5", compatible Sabvoton.</p>
            <button class="btn btn-primary"><i class="fas fa-shopping-cart"></i> comprar</button>
          </div>
          <div class="design-item product-card reveal" data-category="accesorios">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Cinturón de seguridad">
            </div>
            <h3>Cinturón de seguridad</h3>
            <span class="product-price">$ 4,575</span>
            <p>Arnés de 5 puntos, liberación rápida.</p>
            <button class="btn btn-primary"><i class="fas fa-shopping-cart"></i> comprar</button>
          </div>
          <div class="design-item product-card reveal" data-category="accesorios">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Taza cerámica">
            </div>
            <h3>Taza cerámica</h3>
            <span class="product-price">$ 199</span>
            <p>Diseño minimalista, 330 ml, apta microondas.</p>
            <button class="btn btn-primary"><i class="fas fa-shopping-cart"></i> comprar</button>
          </div>
          <div class="design-item product-card reveal" data-category="accesorios">
            <div class="product-image">
              <img src="https://images.unsplash.com/photo-1572372055687-9c3f5d6b3f3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Pack de stickers">
            </div>
            <h3>Pack de stickers</h3>
            <span class="product-price">$ 89</span>
            <p>5 diseños exclusivos, vinilo resistente al agua.</p>
            <button class="btn btn-primary"><i class="fas fa-shopping-cart"></i> comprar</button>
          </div>
        </div>
      </div>
    </section>
    <section class="safety" style="background: var(--black-deep); padding: 6rem 0;">
      <div class="section-container">
        <div class="safety-grid info-grid" style="grid-template-columns: repeat(3, 1fr); gap: 3rem;">
          <div class="glass-panel info-panel reveal">
            <i class="fas fa-truck"></i>
            <h3>Envío a todo México</h3>
            <p>Entrega garantizada en 3-7 días hábiles.</p>
          </div>
          <div class="glass-panel info-panel reveal">
            <i class="fas fa-shield-alt"></i>
            <h3>Garantía de 30 días</h3>
            <p>Devolución sin complicaciones.</p>
          </div>
          <div class="glass-panel info-panel reveal">
            <i class="fas fa-credit-card"></i>
            <h3>Pagos seguros</h3>
            <p>Tarjetas, transferencias y PayPal.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo">
          <img src="img/logos/Photonix.svg" alt="Photonix 7" width="48" height="48">
        </div>
        <span class="footer-tagline">energía que transforma</span>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>Photonix 7</h4>
          <ul>
            <li><a href="nosotros.blade.php">sobre nosotros</a></li>
            <li><a href="tienda.blade.php">tienda</a></li>
            <li><a href="welcome.blade.php#design">diseño</a></li>
            <li><a href="welcome.blade.php#engineering">ingeniería</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>competición</h4>
          <ul>
            <li>E‑Challenge Gto 2025</li>
            <li>Electratón</li>
            <li>modalidad 2</li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>origen</h4>
          <ul>
            <li>Universidad Politécnica de Pénjamo</li>
            <li>Ing. Mecatrónica · Automotriz</li>
            <li>Guanajuato, México</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Photonix 7 · todos los derechos reservados</span>
      <span class="footer-local">hecho con orgullo local</span>
    </div>
  </footer>
  <script src="{{ asset('js/main.js') }}"></script>
  <script src="{{ asset('js/sobrenosotros.js') }}"></script>
  <script src="{{ asset('js/tienda.js') }}"></script>
  <script src="{{ asset('js/menu.js') }}"></script>
  <script src="{{ asset('js/loader.js') }}"></script>
  <script>
    (function() {
      const filterButtons = document.querySelectorAll('.category-btn');
      const products = document.querySelectorAll('.product-card');
      filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const category = btn.dataset.category;
          filterButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          products.forEach(product => {
            if (category === 'all' || product.dataset.category === category) {
              product.style.display = 'flex';
            } else {
              product.style.display = 'none';
            }
          });
        });
      });
      const reveals = document.querySelectorAll('.reveal');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      });
      reveals.forEach(el => observer.observe(el));
    })();
  </script>
  <script src="{{ asset('js/login.js') }}"></script>
  <script>
    (function initHeroSlider() {
      const track = document.getElementById('heroSliderTrack');
      if (!track) return;
      const slides = Array.from(track.children);
      const totalSlides = slides.length;
      if (totalSlides <= 1) return;
      let currentIndex = 0;
      let isMoving = false;
      let autoSlideInterval;
      const goToSlide = (index) => {
        if (isMoving) return;
        isMoving = true;
        currentIndex = index;
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        const dots = document.querySelectorAll('.hero-slider-dot');
        if (dots.length) {
          dots.forEach(dot => dot.classList.remove('active'));
          if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        }
        setTimeout(() => {
          isMoving = false;
        }, 1200);
      };
      const nextSlide = () => {
        const nextIndex = (currentIndex + 1) % totalSlides;
        goToSlide(nextIndex);
      };
      const prevSlide = () => {
        const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
      };
      const startAutoPlay = () => {
        stopAutoPlay();
        autoSlideInterval = setInterval(() => {
          nextSlide();
        }, 5000);
      };
      const stopAutoPlay = () => {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
      };
      const createDots = () => {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'hero-slider-dots';
        for (let i = 0; i < totalSlides; i++) {
          const dot = document.createElement('span');
          dot.className = 'hero-slider-dot';
          dot.addEventListener('click', () => {
            stopAutoPlay();
            goToSlide(i);
            startAutoPlay();
          });
          dotsContainer.appendChild(dot);
        }
        document.querySelector('#shop-hero').appendChild(dotsContainer);
        dotsContainer.children[0].classList.add('active');
      };
      goToSlide(0);
      createDots();
      startAutoPlay();
      const heroSection = document.querySelector('#shop-hero');
      heroSection.addEventListener('mouseenter', stopAutoPlay);
      heroSection.addEventListener('mouseleave', startAutoPlay);
    })();
  </script>
</body>
</html>