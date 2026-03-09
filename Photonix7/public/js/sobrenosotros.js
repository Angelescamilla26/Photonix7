/**
 * PHOTONIX 7 — SOBRE NOSOTROS
 * JavaScript específico para la página de equipo
 * Versión 4.0 — Scroll reveal definitivo (sin desapariciones)
 */

(() => {
  'use strict';

  // ============================================
  // 1. DETECCIÓN DE PÁGINA
  // ============================================
  const isAboutPage = () => {
    const path = window.location.pathname;
    return path.includes('sobre-nosotros') || path.includes('sobre-nosotros.html');
  };

  if (!isAboutPage()) return;

  // ============================================
  // 2. SCROLL REVEAL MEJORADO (CORAZÓN DEL PROBLEMA)
  // ============================================
  const initScrollReveal = () => {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    // Si no hay elementos, salir
    if (!reveals.length) return;

    // Configuración del observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Añadir clase active
          entry.target.classList.add('active');
          // Dejar de observar este elemento (solo se activa una vez)
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2, // Se activa cuando el 20% del elemento es visible
      rootMargin: '0px' // Sin margen negativo
    });

    // Observar cada elemento
    reveals.forEach(el => observer.observe(el));

    // Fallback: si después de 3 segundos algún elemento no tiene la clase active,
    // se la forzamos (por si el observer falla o el usuario hace scroll muy rápido)
    setTimeout(() => {
      reveals.forEach(el => {
        if (!el.classList.contains('active')) {
          el.classList.add('active');
        }
      });
    }, 3000);
  };

  // ============================================
  // 3. ANIMACIÓN DE ENTRADA PARA TARJETAS
  // ============================================
  const animateTeamCards = () => {
    const cards = document.querySelectorAll('.team-card');
    if (!cards.length) return;

    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px) rotateX(5deg)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) rotateX(0)';
      }, 150 + (index * 80));
    });
  };

  // ============================================
  // 4. EFECTO GLOW EN AVATARES
  // ============================================
  const initAvatarGlow = () => {
    const avatars = document.querySelectorAll('.team-avatar, .mentor-avatar');
    
    avatars.forEach(avatar => {
      avatar.addEventListener('mousemove', (e) => {
        const rect = avatar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / 10;
        const deltaY = (y - centerY) / 10;
        
        avatar.style.transform = `perspective(500px) rotateX(${-deltaY}deg) rotateY(${deltaX}deg) scale3d(1.08, 1.08, 1.08)`;
        
        const glowX = (x / rect.width) * 100;
        const glowY = (y / rect.height) * 100;
        avatar.style.boxShadow = `0 0 30px rgba(227,6,19,0.6), radial-gradient(circle at ${glowX}% ${glowY}%, rgba(0,128,255,0.3) 0%, transparent 70%)`;
      });

      avatar.addEventListener('mouseleave', () => {
        avatar.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        avatar.style.boxShadow = '';
      });
    });
  };

  // ============================================
  // 5. CONTADORES ANIMADOS
  // ============================================
  const initCounters = () => {
    const counters = document.querySelectorAll('.stat-number[data-target], [data-counter]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.dataset.animated === 'true') return;
          el.dataset.animated = 'true';

          const target = parseInt(el.getAttribute('data-target') || el.innerText, 10);
          if (isNaN(target)) return;

          let current = 0;
          const step = target / 80;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              el.innerText = target;
              clearInterval(timer);
            } else {
              el.innerText = Math.floor(current);
            }
          }, 16);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  };

  // ============================================
  // 6. EFECTO DE ESCRITURA EN HERO
  // ============================================
  const initHeroTyping = () => {
    const heroSubtitle = document.querySelector('.hero-title .title-small');
    if (!heroSubtitle) return;
    
    const originalText = heroSubtitle.innerText;
    if (originalText !== 'el equipo · la historia · el futuro') return;
    
    heroSubtitle.innerText = '';
    let i = 0;
    const timer = setInterval(() => {
      if (i < originalText.length) {
        heroSubtitle.innerText += originalText.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 80);
  };

  // ============================================
  // 7. BOTÓN SCROLL TOP
  // ============================================
  const initScrollTop = () => {
    const scrollBtn = document.getElementById('scrollTop');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // ============================================
  // 8. INICIALIZACIÓN GENERAL
  // ============================================
  const init = () => {
    // Forzar visibilidad inicial de las secciones (fallback)
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    // Ejecutar animaciones después de un breve retraso
    setTimeout(() => {
      initScrollReveal();    // ← Este es el que corrige el problema
      animateTeamCards();
      initAvatarGlow();
      initCounters();
      initHeroTyping();
      initScrollTop();
    }, 200);
  };

  if (document.readyState === 'Loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exponer globalmente (debug)
  window.PhotonixAbout = { initScrollReveal };
})();