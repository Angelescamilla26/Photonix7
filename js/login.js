(() => {
  'use strict';

  const tabs       = document.querySelectorAll('.auth-tab');
  const forms      = document.querySelectorAll('.auth-form');
  const messageDiv = document.getElementById('auth-message');

  const authToggle  = document.getElementById('authToggle');
  const userProfile = document.getElementById('userProfile');
  const userNameSpan = document.getElementById('userName');

  const getCsrfToken = () =>
    document.querySelector('meta[name="csrf-token"]')?.content ?? '';

  const showMessage = (text, type = 'error') => {
    if (!messageDiv) return;
    messageDiv.textContent = String(text);
    messageDiv.className = `auth-message ${type}`;
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const clearMessage = () => {
    if (!messageDiv) return;
    messageDiv.textContent = '';
    messageDiv.className = 'auth-message';
  };

  const setFieldState = (input, isValid, errorMsg) => {
    const group = input.closest('.input-group');
    if (!group) return;
    const errDiv = group.querySelector('.error-message');
    if (!errDiv) return;

    group.classList.toggle('valid',   isValid);
    group.classList.toggle('invalid', !isValid);

    if (isValid) {
      errDiv.textContent = '✓';
      errDiv.style.color = '#0080FF';
    } else {
      errDiv.textContent = errorMsg;
      errDiv.style.color = '#E30613';
    }
  };

  const clearFieldState = (input) => {
    const group = input.closest('.input-group');
    if (!group) return;
    group.classList.remove('valid', 'invalid');
    const errDiv = group.querySelector('.error-message');
    if (errDiv) { errDiv.textContent = ''; errDiv.style.color = ''; }
  };

  const setLoading = (formId, loading) => {
    const btn = document.querySelector(`#${formId} .auth-submit`);
    if (!btn) return;
    btn.classList.toggle('loading', loading);
    btn.disabled = loading;
  };

  const handleResponse = async (res, formId) => {
    setLoading(formId, false);
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('application/json'))
      throw new Error('Respuesta inesperada del servidor');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? 'Error en la petición');
    return data;
  };

  const safeParseUser = (raw) => {
    try {
      const u = JSON.parse(raw);
      if (!u || typeof u !== 'object' || typeof u.name !== 'string') return null;
      return { name: u.name };
    } catch {
      return null;
    }
  };

  const updateAuthUI = () => {
    if (!authToggle || !userProfile || !userNameSpan) return;
    const raw = localStorage.getItem('user');
    const user = raw ? safeParseUser(raw) : null;

    if (user) {
      userNameSpan.textContent = `Hola, ${user.name}`;
      authToggle.style.display  = 'none';
      userProfile.style.display = 'flex';
    } else {
      localStorage.removeItem('user');
      authToggle.style.display  = 'flex';
      userProfile.style.display = 'none';
    }
  };

  const logout = () => {
    fetch('/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-CSRF-TOKEN': getCsrfToken(),
        'Content-Type': 'application/json',
      },
    })
      .catch(() => {})
      .finally(() => {
        localStorage.removeItem('user');
        if (authToggle && userProfile) {
          userProfile.classList.remove('active');
          updateAuthUI();
        } else {
          window.location.href = '/tienda';
        }
        showMessage('Sesión cerrada correctamente', 'success');
      });
  };

  if (userProfile) {
    userProfile.addEventListener('click', (e) => {
      if (e.target.closest('.user-dropdown')) return;
      userProfile.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!userProfile.contains(e.target))
        userProfile.classList.remove('active');
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target?.id === 'logoutBtn') {
      e.preventDefault();
      logout();
    }
  });

  updateAuthUI();

  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (tab.classList.contains('active')) return;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        clearMessage();

        const target = tab.dataset.tab;
        forms.forEach(f => {
          f.classList.remove('active', 'tab-exit');
          void f.offsetWidth;
        });

        const next = document.getElementById(`${target}-form`);
        if (next) {
          next.classList.add('active');
          next.querySelectorAll('.input-group').forEach(g => {
            g.classList.remove('valid', 'invalid');
            const err = g.querySelector('.error-message');
            if (err) { err.textContent = ''; err.style.color = ''; }
          });
          next.querySelector('input')?.focus();
        }
      });
    });
  }

  const V = {
    email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    password: v => v.length >= 6,
    phone:    v => v.replace(/\D/g, '').length >= 10,
    required: v => v.trim() !== '',
    postal:   v => /^\d{5}$/.test(v.trim()),
    match:    (v, ref) => v === ref,
  };

  const fieldRules = {
    'login-email':            i => [V.email(i.value),                              'correo inválido'],
    'login-password':         i => [i.value.length > 0,                            'contraseña requerida'],
    'register-name':          i => [V.required(i.value),                           'nombre requerido'],
    'register-email':         i => [V.email(i.value),                              'correo inválido'],
    'register-phone':         i => [V.phone(i.value),                              'mínimo 10 dígitos'],
    'register-street':        i => [V.required(i.value),                           'calle requerida'],
    'register-neighborhood':  i => [V.required(i.value),                           'colonia requerida'],
    'register-city':          i => [V.required(i.value),                           'ciudad requerida'],
    'register-state':         i => [V.required(i.value),                           'estado requerido'],
    'register-postal':        i => [V.postal(i.value),                             'código postal inválido (5 dígitos)'],
    'register-country':       i => [V.required(i.value),                           'país requerido'],
    'register-password':      i => [V.password(i.value),                           'mínimo 6 caracteres'],
    'register-confirm':       i => [V.match(i.value, document.getElementById('register-password')?.value ?? ''), 'no coincide'],
  };

  const runRule = (id) => {
    const input = document.getElementById(id);
    if (!input) return true;
    if (input.value === '' && !input.classList.contains('touched')) return true;
    const [ok, msg] = fieldRules[id](input);
    setFieldState(input, ok, msg);
    return ok;
  };

  Object.keys(fieldRules).forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('focus', () => input.classList.add('touched'));

    input.addEventListener('input', () => {
      if (input.classList.contains('touched')) runRule(id);
      if (id === 'register-password') {
        const confirm = document.getElementById('register-confirm');
        if (confirm?.classList.contains('touched')) runRule('register-confirm');
      }
    });

    input.addEventListener('blur', () => {
      if (input.value !== '') runRule(id);
    });
  });

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearMessage();

      const emailInput = document.getElementById('login-email');
      const passInput  = document.getElementById('login-password');

      emailInput.classList.add('touched');
      passInput.classList.add('touched');

      const emailOk = runRule('login-email');
      const passOk  = runRule('login-password');

      if (!emailOk || !passOk) {
        loginForm.querySelector('.input-group.invalid input')?.focus();
        return;
      }

      setLoading('login-form', true);

      fetch('/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify({
          email:    emailInput.value,
          password: passInput.value,
        }),
      })
        .then(res => handleResponse(res, 'login-form'))
        .then(data => {
          showMessage(data.message ?? 'Login exitoso', 'success');
          if (typeof data.user?.name === 'string')
            localStorage.setItem('user', JSON.stringify({ name: data.user.name }));
          setTimeout(() => { window.location.href = '/tienda'; }, 800);
        })
        .catch(err => {
          showMessage(err.message, 'error');
          setLoading('login-form', false);
          passInput.value = '';
          passInput.classList.remove('valid', 'invalid', 'touched');
          passInput.closest('.input-group')?.classList.remove('valid', 'invalid');
        });
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearMessage();

      const ids = Object.keys(fieldRules).filter(id => id.startsWith('register-'));
      ids.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.classList.add('touched');
      });

      const allValid = ids.every(id => runRule(id));

      if (!allValid) {
        registerForm.querySelector('.input-group.invalid input')?.focus();
        showMessage('Por favor corrige los campos marcados', 'error');
        return;
      }

      setLoading('register-form', true);

      const get = id => document.getElementById(id)?.value ?? '';

      fetch('/register', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify({
          name:                  get('register-name'),
          email:                 get('register-email'),
          phone:                 get('register-phone'),
          street:                get('register-street'),
          neighborhood:          get('register-neighborhood'),
          city:                  get('register-city'),
          state:                 get('register-state'),
          postal_code:           get('register-postal'),
          country:               get('register-country'),
          password:              get('register-password'),
          password_confirmation: get('register-confirm'),
        }),
      })
        .then(res => handleResponse(res, 'register-form'))
        .then(data => {
          showMessage(data.message ?? 'Registro exitoso. Ahora inicia sesión.', 'success');
          registerForm.reset();
          registerForm.querySelectorAll('.input-group').forEach(g => {
            g.classList.remove('valid', 'invalid');
            const err = g.querySelector('.error-message');
            if (err) { err.textContent = ''; err.style.color = ''; }
          });
          registerForm.querySelectorAll('input').forEach(i => i.classList.remove('touched'));
          setTimeout(() => {
            document.querySelector('[data-tab="login"]')?.click();
          }, 1200);
        })
        .catch(err => {
          showMessage(err.message, 'error');
          setLoading('register-form', false);
        });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      clearMessage();
      userProfile?.classList.remove('active');
    }
  });

})();
document.getElementById('register-password')?.addEventListener('input', function () {
  const val = this.value;
  let strength = 0;
  if (val.length >= 8) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++;

  const bar = document.getElementById('password-strength');
  const labels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
  const colors = ['', '#E30613', '#f59e0b', '#0080FF', '#22c55e'];

  if (bar) {
    bar.style.width = (strength * 25) + '%';
    bar.style.background = colors[strength];
    bar.setAttribute('aria-valuenow', strength * 25);
  }
  const label = document.getElementById('password-strength-label');
  if (label) label.textContent = labels[strength];
});