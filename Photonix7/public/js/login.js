(() => {
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');
  const messageDiv = document.getElementById('auth-message');

  const authToggle = document.getElementById('authToggle');
  const userProfile = document.getElementById('userProfile');
  const userNameSpan = document.getElementById('userName');

  const showMessage = (text, type = 'error') => {
    if (!messageDiv) return;
    messageDiv.textContent = String(text);
    messageDiv.className = `auth-message ${type}`;
  };

  const clearMessage = () => {
    if (!messageDiv) return;
    messageDiv.textContent = '';
    messageDiv.className = 'auth-message';
  };

  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        forms.forEach(form => form.classList.remove('active'));
        if (target === 'login') {
          document.getElementById('login-form')?.classList.add('active');
        } else {
          document.getElementById('register-form')?.classList.add('active');
        }
        clearMessage();
      });
    });
  }

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pass) => pass.length >= 6;
  const validatePhone = (phone) => /^\d{10,}$/.test(phone.replace(/\D/g, ''));
  const validateRequired = (value) => value.trim() !== '';
  const validatePostal = (postal) => /^\d{5}$/.test(postal.trim());

  const validateField = (input, condition, errorMsg) => {
    const group = input.closest('.input-group');
    if (!group) return;
    const errorDiv = group.querySelector('.error-message');
    if (!errorDiv) return;

    if (condition) {
      group.classList.remove('invalid');
      group.classList.add('valid');
      errorDiv.textContent = '✓';
      errorDiv.style.color = '#0080FF';
    } else {
      group.classList.remove('valid');
      group.classList.add('invalid');
      errorDiv.textContent = errorMsg;
      errorDiv.style.color = '#E30613';
    }
  };

  const getCsrfToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.content : '';
  };

  const setLoading = (formId, isLoading) => {
    const submitBtn = document.querySelector(`#${formId} .auth-submit`);
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    } else {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  };

  const handleFetchResponse = async (response, formId) => {
    setLoading(formId, false);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Respuesta no válida del servidor');
    }
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }
    return data;
  };

  const safeParseUser = (data) => {
    try {
      const user = JSON.parse(data);
      if (typeof user !== 'object' || user === null) return null;
      if (!user.name || typeof user.name !== 'string') return null;
      return { name: user.name };
    } catch {
      return null;
    }
  };

  const updateUIBasedOnAuth = () => {
    if (!authToggle || !userProfile || !userNameSpan) return;

    const userData = localStorage.getItem('user');
    if (userData) {
      const user = safeParseUser(userData);
      if (user) {
        userNameSpan.textContent = `Hola, ${user.name}`;
        authToggle.style.display = 'none';
        userProfile.style.display = 'flex';
        return;
      } else {
        localStorage.removeItem('user');
      }
    }

    authToggle.style.display = 'flex';
    userProfile.style.display = 'none';
  };

  const logout = () => {
    fetch('/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-CSRF-TOKEN': getCsrfToken(),
        'Content-Type': 'application/json'
      }
    })
      .catch(() => { })
      .finally(() => {
        localStorage.removeItem('user');
        if (authToggle && userProfile) {
          updateUIBasedOnAuth();
          userProfile.classList.remove('active');
        } else {
          window.location.href = '/tienda';
        }
        showMessage('Sesión cerrada correctamente', 'success');
      });
  };

  if (userProfile) {
    userProfile.addEventListener('click', (e) => {
      console.log('Click en perfil'); 
      if (e.target.closest('.user-dropdown')) return; document.getElementById('userProfile').classList.add('active');
    });
    
    document.addEventListener('click', (e) => { 
      if (!userProfile.contains(e.target)) { 
        userProfile.classList.remove('active');
      } 
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'logoutBtn') {
      e.preventDefault();
      logout();
    }
  });

  updateUIBasedOnAuth();

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearMessage();

      const email = document.getElementById('login-email');
      const pass = document.getElementById('login-password');

      const emailValid = validateEmail(email.value);
      const passValid = pass.value.length > 0;

      validateField(email, emailValid, 'correo inválido');
      validateField(pass, passValid, 'contraseña requerida');

      if (emailValid && passValid) {
        setLoading('login-form', true);

        fetch('/login', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken()
          },
          body: JSON.stringify({
            email: email.value,
            password: pass.value
          })
        })
          .then(res => handleFetchResponse(res, 'login-form'))
          .then(data => {
            showMessage(data.message || 'Login exitoso', 'success');
            if (data.user && typeof data.user.name === 'string') {
              localStorage.setItem('user', JSON.stringify({ name: data.user.name }));
            }
            window.location.href = '/tienda';
          })
          .catch(err => {
            showMessage(err.message, 'error');
            setLoading('login-form', false);
          });
      }
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearMessage();

      const name = document.getElementById('register-name');
      const email = document.getElementById('register-email');
      const phone = document.getElementById('register-phone');
      const street = document.getElementById('register-street');
      const neighborhood = document.getElementById('register-neighborhood');
      const city = document.getElementById('register-city');
      const state = document.getElementById('register-state');
      const postal = document.getElementById('register-postal');
      const country = document.getElementById('register-country');
      const pass = document.getElementById('register-password');
      const confirm = document.getElementById('register-confirm');

      const nameValid = validateRequired(name.value);
      const emailValid = validateEmail(email.value);
      const phoneValid = validatePhone(phone.value);
      const streetValid = validateRequired(street.value);
      const neighborhoodValid = validateRequired(neighborhood.value);
      const cityValid = validateRequired(city.value);
      const stateValid = validateRequired(state.value);
      const postalValid = validatePostal(postal.value);
      const countryValid = validateRequired(country.value);
      const passValid = validatePassword(pass.value);
      const confirmValid = pass.value === confirm.value;

      validateField(name, nameValid, 'nombre requerido');
      validateField(email, emailValid, 'correo inválido');
      validateField(phone, phoneValid, 'mínimo 10 dígitos');
      validateField(street, streetValid, 'calle requerida');
      validateField(neighborhood, neighborhoodValid, 'colonia requerida');
      validateField(city, cityValid, 'ciudad requerida');
      validateField(state, stateValid, 'estado requerido');
      validateField(postal, postalValid, 'código postal inválido (5 dígitos)');
      validateField(country, countryValid, 'país requerido');
      validateField(pass, passValid, 'mínimo 6 caracteres');
      validateField(confirm, confirmValid, 'no coincide');

      if (nameValid && emailValid && phoneValid && streetValid && neighborhoodValid && cityValid && stateValid && postalValid && countryValid && passValid && confirmValid) {
        setLoading('register-form', true);

        fetch('/register', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken()
          },
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            phone: phone.value,
            street: street.value,
            neighborhood: neighborhood.value,
            city: city.value,
            state: state.value,
            postal_code: postal.value,
            country: country.value,
            password: pass.value,
            password_confirmation: confirm.value
          })
        })
          .then(res => handleFetchResponse(res, 'register-form'))
          .then(data => {
            showMessage(data.message || 'Registro exitoso', 'success');
            setLoading('register-form', false);
            const loginTab = document.querySelector('[data-tab="login"]');
            if (loginTab) loginTab.click();
          })
          .catch(err => {
            showMessage(err.message, 'error');
            setLoading('register-form', false);
          });
      }
    });
  }

  const validators = {
    'login-email': (input) => validateField(input, validateEmail(input.value), 'correo inválido'),
    'login-password': (input) => validateField(input, input.value.length > 0, 'contraseña requerida'),
    'register-name': (input) => validateField(input, validateRequired(input.value), 'nombre requerido'),
    'register-email': (input) => validateField(input, validateEmail(input.value), 'correo inválido'),
    'register-phone': (input) => validateField(input, validatePhone(input.value), 'mínimo 10 dígitos'),
    'register-street': (input) => validateField(input, validateRequired(input.value), 'calle requerida'),
    'register-neighborhood': (input) => validateField(input, validateRequired(input.value), 'colonia requerida'),
    'register-city': (input) => validateField(input, validateRequired(input.value), 'ciudad requerida'),
    'register-state': (input) => validateField(input, validateRequired(input.value), 'estado requerido'),
    'register-postal': (input) => validateField(input, validatePostal(input.value), 'código postal inválido'),
    'register-country': (input) => validateField(input, validateRequired(input.value), 'país requerido'),
    'register-password': (input) => validateField(input, validatePassword(input.value), 'mínimo 6 caracteres'),
    'register-confirm': (input) => {
      const pass = document.getElementById('register-password').value;
      validateField(input, input.value === pass, 'no coincide');
    }
  };

  ['input', 'blur'].forEach(event => {
    Object.keys(validators).forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener(event, () => validators[id](input));
      }
    });
  });
})();