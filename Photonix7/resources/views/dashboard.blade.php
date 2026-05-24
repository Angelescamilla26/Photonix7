<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Photonix 7 — Dashboard</title>
  <meta name="description" content="Panel de control de Photonix 7. Gestiona tus pedidos, perfil y más.">
  <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
  <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</head>

<body>
  <div class="cursor"></div>
  <div class="cursor-follower"></div>

  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img src="img/logos/Photonix.svg" alt="Photonix 7" width="40" height="40">
        <span>Photonix 7</span>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li class="active"><a href="#"><i class="fas fa-home"></i> Inicio</a></li>
          <li><a href="#"><i class="fas fa-shopping-bag"></i> Mis pedidos</a></li>
          <li><a href="#"><i class="fas fa-user"></i> Perfil</a></li>
          <li><a href="#"><i class="fas fa-cog"></i> Ajustes</a></li>
          <li><a href="tienda"><i class="fas fa-store"></i> Ir a la tienda</a></li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <button class="logout-btn" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Cerrar sesión</button>
      </div>
    </aside>

    <!-- Contenido principal -->
    <main class="main-content">
      <!-- Header con saludo y búsqueda -->
      <!-- Header con saludo, búsqueda y menú móvil -->
      <header class="dashboard-header">
        <button class="menu-toggle" id="menuToggle" aria-label="Menú">
          <i class="fas fa-bars"></i>
        </button>
        <div class="header-search">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Buscar...">
        </div>
        <div class="header-user">
          <span class="user-greeting" id="userGreeting">Hola, <span id="userName"></span></span>
          <div class="user-avatar">
            <img src="https://ui-avatars.com/api/?name=Photonix+7&background=E30613&color=fff&size=40" alt="Avatar">
          </div>
        </div>
      </header>
      <!-- Tarjetas de estadísticas -->
      <section class="stats-cards">
        <div class="stat-card">
          <i class="fas fa-shopping-cart"></i>
          <div class="stat-info">
            <span class="stat-value">12</span>
            <span class="stat-label">Pedidos totales</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-dollar-sign"></i>
          <div class="stat-info">
            <span class="stat-value">$3,240</span>
            <span class="stat-label">Gastado</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-truck"></i>
          <div class="stat-info">
            <span class="stat-value">3</span>
            <span class="stat-label">En camino</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-star"></i>
          <div class="stat-info">
            <span class="stat-value">4.8</span>
            <span class="stat-label">Valoración</span>
          </div>
        </div>
      </section>

      <!-- Gráfica y pedidos recientes -->
      <div class="dashboard-grid">
        <!-- Gráfica de ventas / actividad -->
        <div class="card chart-card">
          <h3><i class="fas fa-chart-line"></i> Actividad reciente</h3>
          <canvas id="activityChart"></canvas>
        </div>

        <!-- Pedidos recientes -->
        <div class="card recent-orders">
          <h3><i class="fas fa-history"></i> Pedidos recientes</h3>
          <table class="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody id="ordersBody">
              <!-- Aqui se llenarn los pedidos recientes con JavaScript -->
            </tbody>
          </table>
          <a href="#" class="view-all">Ver todos <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
      <section id="pedidos-section" class="content-section">
        <h2 class="section-title"><i class="fas fa-shopping-bag"></i> Mis pedidos</h2>
        <div class="card">
          <div class="table-responsive">
            <table class="orders-table full-width" id="allOrdersTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="allOrdersBody">
                <!-- Se llenará con JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="perfil-section" class="content-section">
        <h2 class="section-title"><i class="fas fa-user"></i> Perfil</h2>
        <div class="card">
          <p>Aquí irá la información del perfil (próximamente).</p>
        </div>
      </section>

      <section id="ajustes-section" class="content-section">
        <h2 class="section-title"><i class="fas fa-cog"></i> Ajustes</h2>
        <div class="card">
          <form id="settingsForm" class="settings-form">
            <div class="form-group">
              <label for="email">Correo electrónico</label>
              <input type="email" id="email" name="email" value="usuario@example.com" disabled>
            </div>
            <div class="form-group">
              <label for="current_password">Contraseña actual</label>
              <input type="password" id="current_password" name="current_password">
            </div>
            <div class="form-group">
              <label for="new_password">Nueva contraseña</label>
              <input type="password" id="new_password" name="new_password">
            </div>
            <div class="form-group">
              <label for="confirm_password">Confirmar contraseña</label>
              <input type="password" id="confirm_password" name="confirm_password">
            </div>
            <div class="form-group">
              <label for="notifications">
                <input type="checkbox" id="notifications" name="notifications" checked> Recibir notificaciones por email
              </label>
            </div>
            <button type="submit" class="btn-primary">Guardar cambios</button>
          </form>
        </div>
      </section>
    </main>
  </div>

  <script src="{{ asset('js/dashboard.js') }}"></script>
  <script src="{{ asset('js/main.js') }}"></script>
  <script src="{{ asset('js/menu.js') }}"></script>
  <script src="{{ asset('js/loader.js') }}"></script>
</body>

</html>