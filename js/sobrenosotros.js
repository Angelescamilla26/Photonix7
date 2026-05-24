(() => {
  'use strict';

  if (document.body.dataset.page !== 'about') return;

  const raf = requestAnimationFrame;

  const initCursorHovers = () => {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    document.querySelectorAll('.sn-member, .sn-gen-card, .sn-cal-item, .sn-sponsor, .sn-logro-card, .sn-quote, .sn-social-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
      });
    });
  };

  const initScrollReveal = () => {
    const els = document.querySelectorAll('.sn-reveal');
    if (!els.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sn-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    els.forEach(el => obs.observe(el));
  };

  const initCounters = () => {
    const counters = document.querySelectorAll('.sn-counter');
    if (!counters.length) return;

    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const animateCounter = el => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;
      const duration = 1400;
      const start = performance.now();

      const tick = now => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.floor(easeOut(progress) * target);
        if (progress < 1) raf(tick);
        else el.textContent = target;
      };
      raf(tick);
    };

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => obs.observe(el));
  };

  const initHeroCanvas = () => {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? '227,6,19' : '0,128,255',
    }));

    let mouse = { x: -9999, y: -9999 };
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });
    canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; }, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.vx -= (dx / dist) * 0.08;
          p.vy -= (dy / dist) * 0.08;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 90) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf(draw);
    };
    raf(draw);
  };

  const initHeroParallax = () => {
    const heroImage = document.querySelector('.sn-hero__image');
    if (!heroImage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onScroll = () => {
      const y = window.scrollY;
      heroImage.style.transform = `translateY(${y * 0.3}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  };

  const initScrollTop = () => {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const initMemberHover = () => {
    document.querySelectorAll('.sn-member').forEach(member => {
      member.addEventListener('mousemove', e => {
        const rect = member.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
        member.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(4px)`;
      });
      member.addEventListener('mouseleave', () => {
        member.style.transform = '';
      });
    });
  };

  const initHeroTyping = () => {
    const subtitle = document.querySelector('.sn-hero__subtitle');
    if (!subtitle) return;
    const text = subtitle.textContent.trim();
    subtitle.textContent = '';

    const onVisible = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        onVisible.disconnect();
        let i = 0;
        const type = () => {
          if (i < text.length) {
            subtitle.textContent += text[i++];
            setTimeout(type, 45);
          }
        };
        setTimeout(type, 900);
      }
    });
    onVisible.observe(subtitle);
  };

  const initCalendarStagger = () => {
    const items = document.querySelectorAll('.sn-cal-item');
    if (!items.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(items).indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 60}ms`;
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      obs.observe(item);
    });
  };

  const initMemberStagger = () => {
    const cards = document.querySelectorAll('.sn-member, .sn-gen-card');
    if (!cards.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement.children);
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 80}ms`;
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease, background 0.3s ease';
      obs.observe(card);
    });
  };

  const init = () => {
    initCursorHovers();
    initScrollReveal();
    initCounters();
    initHeroCanvas();
    initHeroParallax();
    initScrollTop();
    initMemberHover();
    initHeroTyping();
    initCalendarStagger();
    initMemberStagger();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();