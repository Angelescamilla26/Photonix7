// Cursor y menú interactivo
(function() {
  // Cursor
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    follower.style.left = cursorX + 'px';
    follower.style.top = cursorY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Efecto hover sobre enlaces y botones
  const hoverables = document.querySelectorAll('a, button, .btn, .menu-toggle, .menu-close, .about-link, .about-link2');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      follower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      follower.classList.remove('active');
    });
  });

  // Menú toggle
  const menuToggle = document.getElementById('menuToggle');
  const menuFullscreen = document.getElementById('menuFullscreen');
  const menuClose = document.getElementById('menuClose');
  const menuLinks = document.querySelectorAll('.menu-link');

  function openMenu() {
    menuToggle.classList.add('active');
    menuFullscreen.classList.add('active');
  }

  function closeMenu() {
    menuToggle.classList.remove('active');
    menuFullscreen.classList.remove('active');
  }

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
      closeMenu();
    });
  });

  // Cerrar menú con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuFullscreen.classList.contains('active')) {
      closeMenu();
    }
  });
})();