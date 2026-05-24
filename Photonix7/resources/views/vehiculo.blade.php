<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Photonix 7 · Nuestro Vehículo</title>
  <link rel="stylesheet" href="{{ asset('css/vehiculo.css') }}">
</head>
<body>
  <!-- Cursor personalizado -->
  <div class="cursor"></div>
  <div class="cursor-follower"></div>

  <!-- Menú toggle (hamburguesa) -->
  <div class="menu-toggle" id="menuToggle">
    <span></span>
    <span></span>
    <span></span>
  </div>

  <!-- Menú fullscreen -->
  <div class="menu-fullscreen" id="menuFullscreen">
    <div class="menu-bg-overlay"></div>
    <div class="menu-container">
      <div class="menu-close" id="menuClose">
        <svg viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </div>
      <nav>
        <ul>
          <li><a href="#hero" class="menu-link"><span class="menu-index">01</span> Inicio</a></li>
          <li><a href="#vehicle" class="menu-link"><span class="menu-index">02</span> Vehículo</a></li>
          <li><a href="#design" class="menu-link"><span class="menu-index">03</span> Diseño</a></li>
          <li><a href="#performance" class="menu-link"><span class="menu-index">04</span> Rendimiento</a></li>
          <li><a href="#gallery" class="menu-link"><span class="menu-index">05</span> Galería</a></li>
        </ul>
      </nav>
      <div class="menu-footer">
        <div class="menu-copyright">© 2026 Photonix 7</div>
        <div class="menu-social">
          <span>IG</span>
          <span>FB</span>
          <span>X</span>
        </div>
      </div>
    </div>
  </div>

  <!-- HERO (adaptado al vehículo) -->
  <section id="hero" class="hero fullscreen">
    <div class="hero-bg-layer"></div>
    <div class="hero-particles"></div>
    <div class="hero-grid-overlay"></div>
    <div class="hero-container">
      <span class="hero-badge">Photonix 7</span>
      <h1 class="hero-title">
        <span class="title-line">El futuro</span>
        <span class="title-line">sobre ruedas</span>
        <span class="title-small">Nuestro vehículo</span>
      </h1>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">0-100</span>
          <span class="stat-label">en 2.8s</span>
        </div>
        <div class="stat">
          <span class="stat-number">800</span>
          <span class="stat-label">km autonomía</span>
        </div>
        <div class="stat">
          <span class="stat-number">+600</span>
          <span class="stat-label">CV</span>
        </div>
      </div>
      <div class="hero-cta">
        <a href="#vehicle" class="btn btn-primary">Explorar</a>
        <a href="#design" class="btn btn-outline">Diseño</a>
      </div>
    </div>
    <!-- Botones laterales (herencia del diseño original) -->
    <div class="hero-about">
      <a href="#vehicle" class="about-link">VEHÍCULO</a>
      <div class="about-line"></div>
    </div>
    <div class="hero-about2">
      <a href="#gallery" class="about-link2">GALERÍA</a>
      <div class="about-line2"></div>
    </div>
  </section>

  <!-- SECCIÓN VEHÍCULO (contenedor 3D) -->
  <section id="vehicle" class="vehicle">
    <div class="section-container">
      <span class="section-tag">Descubre</span>
      <h2>Nuestro <span class="heading-accent">Vehículo</span></h2>
      <div class="vehicle-content">
        <p class="vehicle-description">
          Diseñado para el futuro, nuestro vehículo combina innovación, rendimiento y estilo. Explora cada detalle en 3D y descubre la ingeniería que lo hace único.
        </p>
        <div class="vehicle-model-container">
          <!-- Aquí se insertará el visor 3D (model-viewer, Three.js, etc.) -->
          <!-- Por ejemplo, con <model-viewer> descomentar la siguiente línea y agregar el modelo -->
          <!-- <model-viewer src="modelo.glb" ar ar-modes="webxr scene-viewer quick-look" camera-controls poster="poster.webp" shadow-intensity="1" environment-image="neutral" auto-rotate></model-viewer> -->
        </div>
      </div>
    </div>
  </section>

  <!-- DISEÑO (dimensiones y características) -->
  <section id="design" class="design">
    <div class="section-container">
      <div class="design-header">
        <span class="section-tag">Diseño</span>
        <h2>Forma y <span class="heading-accent">función</span></h2>
      </div>
      <div class="design-dimensions">
        <div class="dimension-card">
          <span class="dimension-value">4,98<span class="dimension-unit">m</span></span>
          <span class="dimension-label">Longitud</span>
        </div>
        <div class="dimension-card">
          <span class="dimension-value">1,98<span class="dimension-unit">m</span></span>
          <span class="dimension-label">Anchura</span>
        </div>
        <div class="dimension-card">
          <span class="dimension-value">1,42<span class="dimension-unit">m</span></span>
          <span class="dimension-label">Altura</span>
        </div>
      </div>
      <div class="design-grid">
        <div class="design-item">
          <h3>Monocasco de fibra</h3>
          <p>Estructura ultraligera en fibra de carbono con refuerzos de aluminio.</p>
        </div>
        <div class="design-item">
          <h3>Aerodinámica activa</h3>
          <p>Alerón trasero y difusores variables para máxima eficiencia.</p>
        </div>
        <div class="design-item">
          <h3>Iluminación láser</h3>
          <p>Faros matrix láser con alcance de 600 m y firma lumínica exclusiva.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- RENDIMIENTO -->
  <section id="performance" class="performance">
    <div class="performance-bg-panels"></div>
    <div class="section-container">
      <div class="performance-header">
        <span class="section-tag">Rendimiento</span>
        <h2>Potencia <span class="heading-accent">brutal</span></h2>
      </div>
      <div class="performance-grid">
        <div class="perf-card">
          <div class="perf-number">2,8<span class="perf-unit">s</span></div>
          <div class="perf-label">0-100 km/h</div>
          <div class="perf-line"></div>
          <span class="perf-note">modo launch control</span>
        </div>
        <div class="perf-card">
          <div class="perf-number">820<span class="perf-unit">km</span></div>
          <div class="perf-label">Autonomía</div>
          <div class="perf-line"></div>
          <span class="perf-note">ciclo WLTP</span>
        </div>
        <div class="perf-card">
          <div class="perf-number">670<span class="perf-unit">CV</span></div>
          <div class="perf-label">Potencia</div>
          <div class="perf-line"></div>
          <span class="perf-note">tracción total</span>
        </div>
        <div class="perf-card">
          <div class="perf-number">350<span class="perf-unit">kW</span></div>
          <div class="perf-label">Carga rápida</div>
          <div class="perf-line"></div>
          <span class="perf-note">10-80% en 18 min</span>
        </div>
      </div>
    </div>
  </section>

  <!-- GALERÍA DE IMÁGENES (fondos simulados) -->
  <section id="gallery" class="gallery">
    <div class="section-container">
      <h2>Vistas del <span class="heading-accent">vehículo</span></h2>
      <div class="gallery-masonry">
        <div class="gallery-item item1" style="background-image: linear-gradient(145deg, #222, #111);">
          <div class="gallery-overlay">Frente</div>
        </div>
        <div class="gallery-item item2" style="background-image: linear-gradient(145deg, #333, #111);">
          <div class="gallery-overlay">Perfil</div>
        </div>
        <div class="gallery-item item3" style="background-image: linear-gradient(145deg, #222, #0a0a0a);">
          <div class="gallery-overlay">Trasera</div>
        </div>
        <div class="gallery-item item4" style="background-image: linear-gradient(145deg, #1a1a1a, #000);">
          <div class="gallery-overlay">Interior</div>
        </div>
        <div class="gallery-item item5" style="background-image: linear-gradient(145deg, #2a2a2a, #0f0f0f);">
          <div class="gallery-overlay">Detalle</div>
        </div>
        <div class="gallery-item item6" style="background-image: linear-gradient(145deg, #252525, #050505);">
          <div class="gallery-overlay">Iluminación</div>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='28' fill='%23e30613' stroke='%230080ff' stroke-width='2'/%3E%3Ctext x='30' y='38' font-size='20' text-anchor='middle' fill='%23fff' font-family='Arial'%3EP7%3C/text%3E%3C/svg%3E" alt="Photonix 7">
        </div>
        <div class="footer-tagline">MOVILIDAD EXTREMA</div>
        <p>© 2026 Photonix 7.<br>Todos los derechos reservados.</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>Explora</h4>
          <ul>
            <li>Vehículo</li>
            <li>Diseño</li>
            <li>Rendimiento</li>
            <li>Galeria</li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Soporte</h4>
          <ul>
            <li>Contacto</li>
            <li>Preguntas</li>
            <li>Manuales</li>
            <li>Actualizaciones</li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <ul>
            <li>Privacidad</li>
            <li>Términos</li>
            <li>Cookies</li>
            <li>Patentes</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-local">Hecho para el futuro</span>
      <span>Diseño innovador · Tecnología propia</span>
    </div>
  </footer>

  <script src="{{ asset('js/vehiculo.js') }}"></script>
  </script>
</body>
</html>