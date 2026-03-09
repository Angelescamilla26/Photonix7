<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Photonix 7 · Acceso</title>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/login.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <div class="cursor"></div>
  <div class="cursor-follower"></div>

  <div class="menu-toggle">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <div class="menu-fullscreen">
    <div class="menu-bg-overlay"></div>
    <div class="menu-container">
      <nav>
        <ul>
          <li><a href="index.html" class="menu-link"><span class="menu-index">00</span> inicio</a></li>
          <li><a href="sobre-nosotros.html" class="menu-link"><span class="menu-index">01</span> sobre nosotros</a></li>
          <li><a href="index.html#design" class="menu-link"><span class="menu-index">02</span> diseño</a></li>
          <li><a href="index.html#engineering" class="menu-link"><span class="menu-index">03</span> ingeniería</a></li>
          <li><a href="index.html#performance" class="menu-link"><span class="menu-index">04</span> rendimiento</a></li>
          <li><a href="index.html#safety" class="menu-link"><span class="menu-index">05</span> seguridad</a></li>
          <li><a href="index.html#gallery" class="menu-link"><span class="menu-index">06</span> galería</a></li>
          <li><a href="index.html#driving" class="menu-link"><span class="menu-index">07</span> conducción</a></li>
          <li><a href="index.html#vision" class="menu-link"><span class="menu-index">08</span> visión</a></li>
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

  <main class="page-auth">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Photonix 7</h1>
        <p>accede a tu cuenta</p>
      </div>
      <div class="auth-tabs">
        <button class="auth-tab active" data-tab="login">iniciar sesión</button>
        <button class="auth-tab" data-tab="register">crear cuenta</button>
      </div>
      <div class="auth-message" id="auth-message"></div>

      <form class="auth-form active" id="login-form">
        <div class="input-group">
          <input type="email" id="login-email" placeholder=" " autocomplete="email">
          <label for="login-email">correo electrónico</label>
          <div class="error-message"></div>
        </div>
        <div class="input-group">
          <input type="password" id="login-password" placeholder=" " autocomplete="current-password">
          <label for="login-password">contraseña</label>
          <div class="error-message"></div>
        </div>
        <button type="submit" class="auth-submit" id="login-submit">
          <span class="btn-text">entrar</span>
          <span class="btn-loader"></span>
        </button>
        <div class="auth-footer">
          ¿olvidaste tu contraseña? <a href="#">recupérala</a>
        </div>
      </form>

      <form class="auth-form" id="register-form">
        <div class="input-group">
          <input type="text" id="register-name" placeholder=" " autocomplete="name">
          <label for="register-name">nombre completo</label>
          <div class="error-message"></div>
        </div>
        <div class="input-group">
          <input type="email" id="register-email" placeholder=" " autocomplete="email">
          <label for="register-email">correo electrónico</label>
          <div class="error-message"></div>
        </div>
        <div class="input-group">
          <input type="tel" id="register-phone" placeholder=" " autocomplete="tel">
          <label for="register-phone">teléfono</label>
          <div class="error-message"></div>
        </div>

        <!-- Campos de dirección completos -->
        <div class="input-group">
          <input type="text" id="register-street" placeholder=" " autocomplete="street-address">
          <label for="register-street">calle y número</label>
          <div class="error-message"></div>
        </div>
        <div class="input-group">
          <input type="text" id="register-neighborhood" placeholder=" " autocomplete="address-level4">
          <label for="register-neighborhood">colonia</label>
          <div class="error-message"></div>
        </div>
        <div class="input-group">
          <input type="text" id="register-city" placeholder=" " autocomplete="address-level2" placeholder="ciudad">
          <label for="register-city">ciudad</label>
          <div class="error-message"></div>
        </div>
        <div class="input-group">
          <input type="text" id="register-state" placeholder=" " autocomplete="address-level1" placeholder="estado">
          <label for="register-state">estado</label>
          <div class="error-message"></div>
        </div>
        <div class="input-group">
          <input type="text" id="register-postal" placeholder=" " autocomplete="postal-code">
          <label for="register-postal">código postal</label>
          <div class="error-message"></div>
        </div>
        <div class="input-group">
          <input type="text" id="register-country" placeholder=" " autocomplete="country" placeholder="país">
          <label for="register-country">país</label>
          <div class="error-message"></div>
        </div>

        <div class="input-group">
          <input type="password" id="register-password" placeholder=" " autocomplete="new-password">
          <label for="register-password">contraseña</label>
          <div class="error-message"></div>
        </div>
        <div class="input-group">
          <input type="password" id="register-confirm" placeholder=" " autocomplete="off">
          <label for="register-confirm">confirmar contraseña</label>
          <div class="error-message"></div>
        </div>
        <button type="submit" class="auth-submit" id="register-submit">
          <span class="btn-text">registrarse</span>
          <span class="btn-loader"></span>
        </button>
        <div class="auth-footer">
          al registrarte aceptas nuestros <a href="#">términos</a>
        </div>
      </form>
    </div>
  </main>

  <footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="img/logos/Photonix.svg" alt="Photonix 7" width="48" height="48" style="filter: brightness(0) invert(1);">
        <span class="footer-tagline">energía que transforma</span>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>Photonix 7</h4>
          <ul>
            <li><a href="sobre-nosotros.html">sobre nosotros</a></li>
            <li><a href="index.html#design">diseño</a></li>
            <li><a href="index.html#engineering">ingeniería</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>competición</h4>
          <ul>
            <li>E‑Challenge Gto 2025</li>
            <li>Electratón</li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>origen</h4>
          <ul>
            <li>Universidad Politécnica de Pénjamo</li>
            <li>Guanajuato, México</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Photonix 7 · todos los derechos reservados</span>
    </div>
  </footer>

  <script src="js/main.js"></script>
  <script src="js/menu.js"></script>
  <script src="js/login.js"></script>
</body>
</html>