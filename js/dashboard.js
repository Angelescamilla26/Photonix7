(() => {
  'use strict';

  const userData = localStorage.getItem('user');
  if (!userData) { window.location.href = '/login'; return; }

  const userNameSpan    = document.getElementById('userName');
  const statTotalOrders = document.querySelector('.stat-card:nth-child(1) .stat-value');
  const statTotalSpent  = document.querySelector('.stat-card:nth-child(2) .stat-value');
  const statInTransit   = document.querySelector('.stat-card:nth-child(3) .stat-value');
  const statRating      = document.querySelector('.stat-card:nth-child(4) .stat-value');
  const ordersBody      = document.getElementById('ordersBody');
  const logoutBtn       = document.getElementById('logoutBtn');
  const sections        = document.querySelectorAll('.content-section');
  const navLinks        = document.querySelectorAll('.sidebar-nav a');
  const menuToggle      = document.getElementById('menuToggle');
  const sidebar         = document.querySelector('.sidebar');
  const overlay         = document.querySelector('.sidebar-overlay');
  const settingsForm    = document.getElementById('settingsForm');
  const formProducto    = document.getElementById('formProducto');
  const profileForm     = document.getElementById('profileForm');

  const getCsrfToken = () =>
    document.querySelector('meta[name="csrf-token"]')?.content ?? '';

  // ─── Notificación ────────────────────────────────────────────────────────────
  const showNotification = (message, type = 'info', duration = 3500) => {
    document.querySelectorAll('.dash-notif').forEach(n => n.remove());
    const palette = { success: '#00C851', error: '#E30613', info: '#0080FF', warning: '#FF8C00' };
    const icons   = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    const color   = palette[type] ?? palette.info;
    const el = document.createElement('div');
    el.className = 'dash-notif';
    el.innerHTML = `<span style="color:${color};font-size:1.6rem;flex-shrink:0;">${icons[type]??'ℹ'}</span><span>${message}</span>`;
    Object.assign(el.style, {
      position:'fixed', bottom:'10rem', right:'3rem',
      background:'rgba(10,10,10,0.96)', color:'#fff',
      padding:'1.4rem 2.4rem', borderRadius:'1.2rem',
      borderLeft:`3px solid ${color}`,
      boxShadow:`0 0.8rem 2.4rem rgba(0,0,0,0.6),0 0 20px ${color}22`,
      zIndex:'10000', fontSize:'1.4rem',
      display:'flex', alignItems:'center', gap:'1.2rem',
      opacity:'0', transform:'translateX(2rem)',
      transition:'opacity 0.3s ease,transform 0.3s ease',
      pointerEvents:'none', maxWidth:'36rem',
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateX(0)'; });
    setTimeout(() => {
      el.style.opacity = '0'; el.style.transform = 'translateX(2rem)';
      setTimeout(() => el.remove(), 300);
    }, duration);
  };

  // ─── Modal de confirmación ───────────────────────────────────────────────────
  const confirmDialog = (msg) =>
    new Promise(resolve => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.78);backdrop-filter:blur(6px);z-index:20000;display:flex;align-items:center;justify-content:center;';
      wrap.innerHTML = `
        <div style="background:#111;border:1px solid rgba(227,6,19,0.3);border-radius:2rem;padding:3.2rem;max-width:44rem;width:90%;box-shadow:0 2rem 6rem rgba(0,0,0,0.8);text-align:center;">
          <div style="font-size:3.2rem;margin-bottom:1.6rem;">⚠️</div>
          <p style="font-size:1.7rem;color:rgba(255,255,255,0.9);line-height:1.6;margin-bottom:2.8rem;">${msg}</p>
          <div style="display:flex;gap:1.2rem;justify-content:center;">
            <button id="dlgCancel"  style="padding:1rem 2.8rem;border-radius:4rem;border:1px solid rgba(255,255,255,0.15);background:transparent;color:#fff;font-size:1.5rem;cursor:pointer;transition:all 0.2s;">Cancelar</button>
            <button id="dlgConfirm" style="padding:1rem 2.8rem;border-radius:4rem;border:none;background:#E30613;color:#fff;font-size:1.5rem;font-weight:700;cursor:pointer;transition:all 0.2s;">Eliminar</button>
          </div>
        </div>`;
      document.body.appendChild(wrap);
      const done = v => { wrap.remove(); resolve(v); };
      wrap.querySelector('#dlgCancel').addEventListener('click',  () => done(false));
      wrap.querySelector('#dlgConfirm').addEventListener('click', () => done(true));
      wrap.addEventListener('click', e => { if (e.target === wrap) done(false); });
    });

  // ─── Dashboard data ──────────────────────────────────────────────────────────
  const loadDashboardData = async () => {
    try {
      const res = await fetch('/dashboard-data', {
        headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': getCsrfToken() },
        credentials: 'same-origin',
      });
      if (!res.ok) { if (res.status === 401) { window.location.href = '/login'; return; } throw new Error(`${res.status}`); }
      const data = await res.json();
      if (userNameSpan && data.user?.name) userNameSpan.textContent = data.user.name;
      if (statTotalOrders) statTotalOrders.textContent = data.stats?.total_orders ?? '0';
      if (statTotalSpent)  statTotalSpent.textContent  = `$${(data.stats?.total_spent ?? 0).toLocaleString()}`;
      if (statInTransit)   statInTransit.textContent   = data.stats?.orders_in_transit ?? '0';
      if (statRating)      statRating.textContent      = (data.stats?.average_rating ?? 4.8).toFixed(1);
      if (ordersBody && data.recent_orders) {
        ordersBody.innerHTML = '';
        data.recent_orders.forEach(o => {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${o.id??''}</td><td>${o.product??'Producto'}</td><td>${o.date??''}</td><td>$${(o.total??0).toLocaleString()}</td><td><span class="status ${o.status??''}">${o.status??'pendiente'}</span></td>`;
          ordersBody.appendChild(tr);
        });
      }
    } catch { showNotification('Error al cargar datos del dashboard', 'error'); }
  };

  // ─── Logout ──────────────────────────────────────────────────────────────────
  const logout = async () => {
    try { await fetch('/logout', { method: 'POST', headers: { 'X-CSRF-TOKEN': getCsrfToken() } }); } catch {}
    finally { localStorage.removeItem('user'); window.location.href = '/login'; }
  };
  logoutBtn?.addEventListener('click', e => { e.preventDefault(); logout(); });

  // ─── Navegación ──────────────────────────────────────────────────────────────
  const sectionMap = {
    'Inicio':            'inicio-section',
    'Mis pedidos':       'pedidos-section',
    'Perfil':            'perfil-section',
    'Ajustes':           'ajustes-section',
    'Agregar producto':  'productos-section',
    'Gestionar pedidos': 'gestion-pedidos-section',
    'Mis productos':     'mis-productos-section',
  };

  const showSection = id => {
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
    const loaders = {
      'pedidos-section':         loadAllOrders,
      'ajustes-section':         loadSettings,
      'perfil-section':          loadProfile,
      'gestion-pedidos-section': loadAdminOrders,
      'mis-productos-section':   loadAdminProducts,
      'productos-section':       loadAdminProducts,
    };
    loaders[id]?.();
    navLinks.forEach(l => {
      l.parentElement.classList.remove('active');
      if (sectionMap[l.textContent.trim()] === id) l.parentElement.classList.add('active');
    });
    if (window.innerWidth <= 768) { sidebar?.classList.remove('open'); overlay?.classList.remove('active'); }
  };

  navLinks.forEach(l => {
    l.addEventListener('click', e => {
      e.preventDefault();
      const t = l.textContent.trim();
      if (t === 'Ir a la tienda') { window.location.href = '/tienda'; return; }
      const id = sectionMap[t];
      if (id) showSection(id);
    });
  });

  menuToggle?.addEventListener('click', () => { sidebar?.classList.toggle('open'); overlay?.classList.toggle('active'); });
  overlay?.addEventListener('click', () => { sidebar?.classList.remove('open'); overlay?.classList.remove('active'); });

  // ─── Pedidos cliente ─────────────────────────────────────────────────────────
  async function loadAllOrders() {
    const tbody = document.getElementById('allOrdersBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:#888">Cargando…</td></tr>`;
    try {
      const res = await fetch('/mis-pedidos', { headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': getCsrfToken() } });
      if (!res.ok) throw new Error(`${res.status}`);
      const orders = await res.json();
      tbody.innerHTML = '';
      if (!orders?.length) { tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;">No tienes pedidos aún</td></tr>`; return; }
      const sMap = { pending:['status-pending','Pendiente'], preparing:['status-preparing','En preparación'], shipped:['status-shipped','En camino'], delivered:['status-delivered','Entregado'] };
      orders.forEach(o => {
        const [cls,txt] = sMap[o.shipping_status] ?? ['', o.shipping_status??'Desconocido'];
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${o.id}</td><td>${o.order_number??'ORD-'+o.id}</td><td>${o.created_at?new Date(o.created_at).toLocaleDateString('es-MX'):''}</td><td>$${Number(o.total??0).toLocaleString('es-MX')}</td><td><span class="status ${o.status??''}">${o.status??'pendiente'}</span></td><td><span class="shipping-status ${cls}">${txt}</span></td><td><button class="btn-small" data-id="${o.id}">Ver detalle</button></td>`;
        tbody.appendChild(tr);
      });
      tbody.querySelectorAll('.btn-small').forEach(b => b.addEventListener('click', () => showNotification('Detalle en desarrollo', 'info')));
    } catch { tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:#E30613;">Error al cargar pedidos</td></tr>`; }
  }

  // ─── Ajustes ─────────────────────────────────────────────────────────────────
  async function loadSettings() {
    try {
      const res = await fetch('/user-settings', { headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': getCsrfToken() } });
      if (!res.ok) throw new Error();
      const s = await res.json();
      const em = document.getElementById('email'); if (em) em.value = s.email ?? '';
      const nt = document.getElementById('notifications'); if (nt) nt.checked = s.notifications ?? false;
    } catch {}
  }

  settingsForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(settingsForm), data = Object.fromEntries(fd.entries());
    data.notifications = fd.get('notifications') === 'on';
    try {
      const res = await fetch('/update-settings', { method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':getCsrfToken()}, body:JSON.stringify(data) });
      showNotification(res.ok ? 'Cambios guardados' : 'Error al guardar', res.ok ? 'success' : 'error');
    } catch { showNotification('Error de conexión', 'error'); }
  });

  // ─── Admin: gestión de pedidos ───────────────────────────────────────────────
  async function loadAdminOrders() {
    const tbody = document.getElementById('adminOrdersBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#888">Cargando…</td></tr>`;
    try {
      const res = await fetch('/admin/pedidos', { headers:{'Accept':'application/json','X-CSRF-TOKEN':getCsrfToken()} });
      if (!res.ok) throw new Error();
      const orders = await res.json();
      tbody.innerHTML = '';
      const lbl = { pending:'Pendiente', preparing:'En preparación', shipped:'En camino', delivered:'Entregado' };
      orders.forEach(o => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${o.id}</td><td>${o.user?.name??'N/A'}</td>
          <td>$${Number(o.total).toLocaleString('es-MX')}</td>
          <td><span class="status ${o.status}">${o.status}</span></td>
          <td><span class="shipping-status status-${o.shipping_status}">${lbl[o.shipping_status]??o.shipping_status}</span></td>
          <td>
            <select class="shipping-select" data-id="${o.id}">
              ${['pending','preparing','shipped','delivered'].map(v=>`<option value="${v}" ${o.shipping_status===v?'selected':''}>${lbl[v]}</option>`).join('')}
            </select>
            <button class="btn-small btn-update-ship" data-id="${o.id}">Actualizar</button>
          </td>`;
        tbody.appendChild(tr);
      });
      tbody.querySelectorAll('.btn-update-ship').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id  = btn.dataset.id;
          const sel = tbody.querySelector(`.shipping-select[data-id="${id}"]`);
          try {
            const res = await fetch(`/admin/pedido/${id}/shipping`, { method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':getCsrfToken(),'Accept':'application/json'}, body:JSON.stringify({shipping_status:sel.value}) });
            const d = await res.json();
            showNotification(res.ok ? 'Estado actualizado' : (d.message??'Error'), res.ok?'success':'error');
            if (res.ok) loadAdminOrders();
          } catch { showNotification('Error de conexión','error'); }
        });
      });
    } catch { showNotification('Error al cargar pedidos admin','error'); }
  }

  // ─── Admin: mis productos + eliminar ─────────────────────────────────────────
  async function loadAdminProducts() {
    const container = document.getElementById('adminProductsList');
    if (!container) return;
    container.innerHTML = `<div class="adm-products-loading"><span class="adm-loading-spinner"></span>Cargando productos…</div>`;
    try {
      const res = await fetch('/admin/products', { headers:{'Accept':'application/json','X-CSRF-TOKEN':getCsrfToken()} });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const products = await res.json();

      if (!products?.length) {
        container.innerHTML = `<div class="adm-products-empty">No hay productos publicados aún.</div>`;
        return;
      }

      container.innerHTML = '';
      const badge = document.getElementById('admProductCount');
      if (badge) badge.textContent = products.length;
      const TRASH_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;

      products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'adm-product-card';
        card.dataset.id = p.id;
        card.innerHTML = `
          <div class="adm-product-card__img">
            ${p.image
              ? `<img src="${p.image}" alt="${p.name??''}" loading="lazy">`
              : `<div class="adm-product-card__no-img">Sin imagen</div>`}
          </div>
          <div class="adm-product-card__info">
            <span class="adm-product-card__name">${p.name ?? 'Sin nombre'}</span>
            <span class="adm-product-card__price">$${Number(p.price ?? 0).toLocaleString('es-MX')}</span>
            <span class="adm-product-card__stock">Stock: ${p.stock ?? '—'}</span>
          </div>
          <button class="adm-product-card__delete" data-id="${p.id}" title="Eliminar producto">
            ${TRASH_SVG} Eliminar
          </button>`;
        container.appendChild(card);
      });

      container.querySelectorAll('.adm-product-card__delete').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id   = btn.dataset.id;
          const name = btn.closest('.adm-product-card')?.querySelector('.adm-product-card__name')?.textContent ?? 'este producto';
          const ok   = await confirmDialog(`¿Eliminar <strong>"${name}"</strong>?<br><br>Esta acción no se puede deshacer.`);
          if (!ok) return;

          btn.disabled = true;
          btn.innerHTML = `<span class="adm-loading-spinner" style="width:1.4rem;height:1.4rem;border-width:2px;margin-right:0.6rem;"></span>Eliminando…`;

          try {
            const res = await fetch(`/admin/products/${id}`, {
              method: 'DELETE',
              headers: { 'X-CSRF-TOKEN': getCsrfToken(), 'Accept': 'application/json' },
            });
            if (res.ok) {
              const card = btn.closest('.adm-product-card');
              card.classList.add('adm-product-card--removing');
              card.addEventListener('animationend', () => card.remove(), { once: true });
              showNotification('Producto eliminado correctamente', 'success');
            } else {
              const d = await res.json().catch(() => ({}));
              showNotification(d.message ?? 'Error al eliminar', 'error');
              btn.disabled = false;
              btn.innerHTML = `${TRASH_SVG} Eliminar`;
            }
          } catch {
            showNotification('Error de conexión', 'error');
            btn.disabled = false;
            btn.innerHTML = `${TRASH_SVG} Eliminar`;
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<div class="adm-products-error">Error al cargar productos.<br><small>${err.message}</small></div>`;
    }
  }

  // ─── Upload progress neón ────────────────────────────────────────────────────
  const uploadProgress  = document.getElementById('uploadProgress');
  const progressBarFill = document.getElementById('progressBarFill');
  const upPctText       = document.getElementById('upPctText');
  const upPctRing       = document.getElementById('upPctRing');
  const upFileName      = document.getElementById('upFileName');
  const upFileIcon      = document.getElementById('upFileIcon');
  const upStatus        = document.getElementById('upStatus');
  const upEta           = document.getElementById('upEta');
  const mensajeProducto = document.getElementById('mensajeProducto');

  // SVG circle circumference r=11: 2π×11 ≈ 69.12
  const CIRC = 69.12;

  const setRing = (pct) => {
    if (!upPctRing) return;
    upPctRing.style.strokeDashoffset = CIRC - (CIRC * pct / 100);
  };

  const setProgress = (pct, fileName = '', eta = '') => {
    if (!uploadProgress) return;
    const p = Math.round(Math.max(0, Math.min(100, pct)));
    uploadProgress.classList.add('active');
    uploadProgress.classList.remove('up-error');
    if (progressBarFill) progressBarFill.style.width  = p + '%';
    if (upPctText)       upPctText.textContent        = p + '%';
    if (fileName && upFileName) upFileName.textContent = fileName;
    if (upEta)           upEta.textContent            = eta;
    setRing(p);

    if (p === 100) {
      uploadProgress.classList.remove('up-uploading');
      uploadProgress.classList.add('up-done');
      if (upFileIcon) upFileIcon.textContent = '✓';
      if (upStatus)   upStatus.textContent   = 'Completado';
    } else if (p > 0) {
      uploadProgress.classList.remove('up-done');
      uploadProgress.classList.add('up-uploading');
      if (upFileIcon) upFileIcon.textContent = '⬆';
      if (upStatus)   upStatus.textContent   = `Subiendo… ${p}%`;
    } else {
      uploadProgress.classList.remove('up-done', 'up-uploading');
      if (upStatus) upStatus.textContent = 'Preparando…';
    }
  };

  const setProgressError = (msg = 'Error en la subida') => {
    if (!uploadProgress) return;
    uploadProgress.classList.add('active', 'up-error');
    uploadProgress.classList.remove('up-uploading', 'up-done');
    if (progressBarFill) progressBarFill.style.width = '100%';
    if (upPctText)       upPctText.textContent       = '!';
    if (upStatus)        upStatus.textContent        = msg;
    if (upFileIcon)      upFileIcon.textContent      = '✕';
    if (upEta)           upEta.textContent           = '';
    setRing(100);
  };

  const resetProgress = () => {
    if (!uploadProgress) return;
    uploadProgress.classList.remove('active', 'up-uploading', 'up-done', 'up-error');
    if (progressBarFill) progressBarFill.style.width  = '0%';
    if (upPctText)       upPctText.textContent        = '0%';
    if (upFileName)      upFileName.textContent       = 'Selecciona un archivo para comenzar';
    if (upFileIcon)      upFileIcon.textContent       = '📁';
    if (upStatus)        upStatus.textContent         = 'Esperando…';
    if (upEta)           upEta.textContent            = '';
    setRing(0);
  };

  // ─── Botón recargar productos ────────────────────────────────────────────────
  document.getElementById('btnReloadProducts')?.addEventListener('click', () => {
    loadAdminProducts();
  });

  if (formProducto) {
    const imageInput = document.getElementById('image');
    imageInput?.addEventListener('change', () => {
      if (imageInput.files.length > 0) {
        const file   = imageInput.files[0];
        const sizeMB = (file.size / 1024 / 1024).toFixed(2);
        const ext    = file.name.split('.').pop().toUpperCase();
        const icon   = ['JPG','JPEG','PNG','WEBP','GIF'].includes(ext) ? '🖼' : '📁';
        if (upFileIcon) upFileIcon.textContent = icon;
        setProgress(0, `${file.name} · ${sizeMB} MB`);
        uploadProgress?.classList.add('active');
      } else { resetProgress(); }
    });

    formProducto.addEventListener('submit', e => {
      e.preventDefault();
      const btn = document.getElementById('btnGuardarProducto');
      btn.disabled = true;
      if (mensajeProducto) { mensajeProducto.textContent = ''; mensajeProducto.className = 'auth-message'; }
      setProgress(0, 'Iniciando…');

      let startTime = null;

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/admin/products', true);
      xhr.setRequestHeader('X-CSRF-TOKEN', getCsrfToken());
      xhr.setRequestHeader('Accept', 'application/json');

      xhr.upload.addEventListener('loadstart', () => { startTime = Date.now(); setProgress(0, 'Preparando…'); });

      xhr.upload.addEventListener('progress', ev => {
        if (!ev.lengthComputable) return;
        const pct      = (ev.loaded / ev.total) * 100;
        const loadedMB = (ev.loaded / 1024 / 1024).toFixed(2);
        const totalMB  = (ev.total  / 1024 / 1024).toFixed(2);
        const elapsed  = (Date.now() - startTime) / 1000;
        const speed    = ev.loaded / elapsed;
        const remaining = speed > 0 ? (ev.total - ev.loaded) / speed : 0;
        const etaStr   = remaining > 1 ? `~${Math.ceil(remaining)}s restantes` : '';
        setProgress(pct, `${loadedMB} MB / ${totalMB} MB`, etaStr);
      });

      xhr.upload.addEventListener('load',  () => setProgress(100, 'Procesando…'));
      xhr.upload.addEventListener('error', () => setProgressError('Error durante la subida'));
      xhr.upload.addEventListener('abort', () => setProgressError('Subida cancelada'));

      xhr.onload = () => {
        btn.disabled = false;
        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100, '✓ Archivo subido correctamente');
          if (mensajeProducto) { mensajeProducto.textContent = 'Producto guardado correctamente'; mensajeProducto.className = 'auth-message success'; }
          formProducto.reset();
          loadAdminProducts();
          setTimeout(resetProgress, 3000);
        } else {
          let msg = 'Error al guardar el producto';
          try { msg = JSON.parse(xhr.responseText).message ?? msg; } catch {}
          setProgressError(msg);
          if (mensajeProducto) { mensajeProducto.textContent = msg; mensajeProducto.className = 'auth-message error'; }
        }
      };

      xhr.onerror = () => {
        btn.disabled = false;
        setProgressError('Error de conexión');
        if (mensajeProducto) { mensajeProducto.textContent = 'Error de conexión'; mensajeProducto.className = 'auth-message error'; }
      };

      xhr.send(new FormData(formProducto));
    });
  }

  // ─── Perfil ──────────────────────────────────────────────────────────────────
  async function loadProfile() {
    try {
      const res = await fetch('/user/profile-data', { headers:{'Accept':'application/json','X-CSRF-TOKEN':getCsrfToken()} });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const map = { profileName:data.name, profileEmail:data.email, profilePhone:data.phone, profileStreet:data.street, profileNeighborhood:data.neighborhood, profileCity:data.city, profileState:data.state, profilePostal:data.postal_code, profileCountry:data.country };
      Object.entries(map).forEach(([id,val]) => { const el = document.getElementById(id); if (el) el.value = val??''; });
      const nd = document.getElementById('profileNameDisplay'); if (nd) nd.textContent = data.name ?? 'Usuario';
      const ms = document.getElementById('profileMemberSince'); if (ms) ms.textContent = data.created_at ?? '';
      const ii = document.getElementById('profileInitials');    if (ii) ii.textContent = data.name ? data.name.charAt(0).toUpperCase() : 'U';
    } catch {}
  }

  profileForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('btnGuardarPerfil');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando…';
    btn.disabled  = true;
    const fd = new FormData(profileForm), data = Object.fromEntries(fd.entries());
    ['current_password','new_password','new_password_confirmation'].forEach(k => { if (!data[k]) delete data[k]; });
    try {
      const res    = await fetch('/user/profile-update', { method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':getCsrfToken(),'Accept':'application/json'}, body:JSON.stringify(data) });
      const result = await res.json();
      showNotification(res.ok ? 'Perfil actualizado correctamente' : (result.message ?? 'Error'), res.ok?'success':'error');
      if (res.ok) { const s = document.getElementById('userName'); if (s&&data.name) s.textContent = data.name; loadProfile(); }
    } catch { showNotification('Error de conexión','error'); }
    finally { btn.innerHTML = orig; btn.disabled = false; }
  });

  // ─── Init ────────────────────────────────────────────────────────────────────
  showSection('inicio-section');
  loadDashboardData();
})();