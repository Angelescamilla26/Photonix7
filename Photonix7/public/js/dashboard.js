(() => {
  'use strict';

  const userData = localStorage.getItem('user');
  if (!userData) {
    window.location.href = '/login';
    return;
  }

  const userNameSpan = document.getElementById('userName');
  const statTotalOrders = document.querySelector('.stat-card:nth-child(1) .stat-value');
  const statTotalSpent = document.querySelector('.stat-card:nth-child(2) .stat-value');
  const statInTransit = document.querySelector('.stat-card:nth-child(3) .stat-value');
  const statRating = document.querySelector('.stat-card:nth-child(4) .stat-value');
  const ordersBody = document.getElementById('ordersBody');
  const logoutBtn = document.getElementById('logoutBtn');

  const getCsrfToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.content : '';
  };

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/dashboard-data', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken()
        },
        credentials: 'same-origin'
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        throw new Error('Error al cargar datos');
      }

      const data = await response.json();

      if (userNameSpan && data.user.name) {
        userNameSpan.textContent = data.user.name;
      }

      if (statTotalOrders) statTotalOrders.textContent = data.stats.total_orders;
      if (statTotalSpent) statTotalSpent.textContent = `$${data.stats.total_spent.toLocaleString()}`;
      if (statInTransit) statInTransit.textContent = data.stats.orders_in_transit;
      if (statRating) statRating.textContent = data.stats.average_rating.toFixed(1);

      if (ordersBody && data.recent_orders) {
        ordersBody.innerHTML = '';
        data.recent_orders.forEach(order => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.product}</td>
            <td>${order.date}</td>
            <td>$${order.total.toLocaleString()}</td>
            <td><span class="status ${order.status}">${order.status}</span></td>
          `;
          ordersBody.appendChild(row);
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const logout = async () => {
    try {
      await fetch('/logout', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': getCsrfToken(),
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');

  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  const sectionMap = {
    'Inicio': 'inicio-section',
    'Mis pedidos': 'pedidos-section',
    'Perfil': 'perfil-section',
    'Ajustes': 'ajustes-section'
  };

  const showSection = (sectionId) => {
    sections.forEach(section => section.classList.remove('active'));
    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.classList.add('active');

    navLinks.forEach(link => {
      link.parentElement.classList.remove('active');
      const linkText = link.textContent.trim();
      if (sectionMap[linkText] === sectionId) {
        link.parentElement.classList.add('active');
      }
    });

    if (sectionId === 'pedidos-section') loadAllOrders();
    else if (sectionId === 'ajustes-section') loadSettings();

    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const linkText = link.textContent.trim();
      if (linkText === 'Ir a la tienda') {
        window.location.href = '/tienda';
        return;
      }
      const sectionId = sectionMap[linkText];
      if (sectionId) showSection(sectionId);
    });
  });

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });
  }

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });

  const loadAllOrders = async () => {
    try {
      const response = await fetch('/all-orders', {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken()
        }
      });
      if (!response.ok) throw new Error('Error al cargar pedidos');
      const orders = await response.json();
      const tbody = document.getElementById('allOrdersBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.product}</td>
          <td>${order.date}</td>
          <td>$${order.total.toLocaleString()}</td>
          <td><span class="status ${order.status}">${order.status}</span></td>
          <td><button class="btn-small" data-id="${order.id}">Ver detalle</button></td>
        `;
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('/user-settings', {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken()
        }
      });
      if (!response.ok) throw new Error('Error al cargar ajustes');
      const settings = await response.json();
      const emailInput = document.getElementById('email');
      const notificationsCheck = document.getElementById('notifications');
      if (emailInput) emailInput.value = settings.email || '';
      if (notificationsCheck) notificationsCheck.checked = settings.notifications || false;
    } catch (error) {
      console.error('Error cargando ajustes:', error);
    }
  };

  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(settingsForm);
      const data = Object.fromEntries(formData.entries());
      data.notifications = formData.get('notifications') === 'on';
      try {
        const response = await fetch('/update-settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken()
          },
          body: JSON.stringify(data)
        });
        if (response.ok) alert('Cambios guardados correctamente');
        else alert('Error al guardar');
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }

  showSection('inicio-section');
  loadDashboardData();
})();