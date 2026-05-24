// main.js
(function () {
    'use strict';

    // Cursor personalizado
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function smoothCursor() {
        posX += (mouseX - posX) * 0.2;
        posY += (mouseY - posY) * 0.2;

        if (cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
        if (follower) {
            follower.style.left = posX + 'px';
            follower.style.top = posY + 'px';
        }
        requestAnimationFrame(smoothCursor);
    }
    smoothCursor();

    // Hover en elementos interactivos
    const interactiveElems = document.querySelectorAll('a, button, .menu-item, .nav-link, .btn');
    interactiveElems.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.backgroundColor = 'var(--electric-blue)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.borderColor = 'var(--electric-blue)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'var(--racing-red)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.borderColor = 'rgba(255,255,255,0.3)';
        });
    });

    // Scroll reveal (fade-in)
    const fadeElements = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2, rootMargin: '0px' });

    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Parallax sutil en hero
    const hero = document.querySelector('.hero-section');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.2}px)`;
            hero.style.opacity = 1 - scrolled / 800;
        }
    });

    // Navegación desde menú fullscreen
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const sectionId = item.dataset.section;
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                // Cerrar menú si está abierto
                document.querySelector('.fullscreen-menu').classList.remove('open');
            }
        });
    });

    // Botones CTA
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById('ingenieria');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
    document.querySelectorAll('.btn-outline').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById('diseno');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
})();
// Script para activar las animaciones reveal al hacer scroll
document.addEventListener('DOMContentLoaded', function () {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));

    // Inicializar contadores si existen (reutilizando el código anterior)
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseFloat(entry.target.getAttribute('data-target'));
                const isFloat = target % 1 !== 0;
                const duration = 1500;
                const startTime = performance.now();

                const updateCounter = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const currentValue = progress * target;
                    entry.target.textContent = isFloat ? currentValue.toFixed(1) : Math.floor(currentValue);

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target;
                    }
                };

                requestAnimationFrame(updateCounter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
});