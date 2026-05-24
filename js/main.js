(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch        = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  function StarField(canvas) {
    if (!canvas) return;
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.stars  = [];
    this.comets = [];
    this.mouse  = { x: 0, y: 0, vx: 0, vy: 0 };
    this._pmx   = 0;
    this._pmy   = 0;
    this.raf    = null;
    this._init();
  }

  StarField.prototype._init = function () {
    this._resize();
    this._populate();
    window.addEventListener('resize', this._resize.bind(this), { passive: true });
    document.addEventListener('mousemove', function (e) {
      this.mouse.vx = e.clientX - this._pmx;
      this.mouse.vy = e.clientY - this._pmy;
      this._pmx = this.mouse.x = e.clientX;
      this._pmy = this.mouse.y = e.clientY;
    }.bind(this), { passive: true });
    this._render();
  };

  StarField.prototype._resize = function () {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this._populate();
  };

  StarField.prototype._populate = function () {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const density = (w * h) / 5200;
    const count   = Math.min(Math.floor(density), 320);
    this.stars    = [];
    for (var i = 0; i < count; i++) {
      var tier = Math.random();
      var r, alpha, speed, color;
      if (tier > 0.96) {
        r = 1.8 + Math.random() * 0.8;
        alpha = 0.85 + Math.random() * 0.15;
        speed = 0.003 + Math.random() * 0.006;
        color = Math.random() > 0.5 ? 'hsl(210,90%,88%)' : 'hsl(355,90%,88%)';
      } else if (tier > 0.75) {
        r = 0.9 + Math.random() * 0.7;
        alpha = 0.5 + Math.random() * 0.4;
        speed = 0.006 + Math.random() * 0.01;
        color = '#f0f2f8';
      } else {
        r = 0.25 + Math.random() * 0.55;
        alpha = 0.18 + Math.random() * 0.45;
        speed = 0.012 + Math.random() * 0.018;
        color = '#e0e4f0';
      }
      this.stars.push({
        x:     Math.random() * w,
        y:     Math.random() * h,
        r:     r,
        alpha: alpha,
        speed: speed,
        phase: Math.random() * Math.PI * 2,
        color: color,
        px:    0,
        py:    0
      });
    }
  };

  StarField.prototype._spawnComet = function () {
    if (Math.random() > 0.004) return;
    this.comets.push({
      x:       Math.random() * this.canvas.width * 0.75,
      y:       Math.random() * this.canvas.height * 0.45,
      length:  60 + Math.random() * 90,
      speed:   6 + Math.random() * 8,
      opacity: 1,
      angle:   Math.PI / 4 + (Math.random() - 0.5) * 0.3
    });
  };

  StarField.prototype._render = function () {
    var self = this;
    var ctx  = this.ctx;
    var now  = performance.now() / 1000;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._spawnComet();

    for (var i = 0; i < this.stars.length; i++) {
      var s = this.stars[i];
      var a = s.alpha * (0.55 + 0.45 * Math.sin(now * s.speed * 6 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, a));
      ctx.fill();
    }

    this.comets = this.comets.filter(function (c) { return c.opacity > 0; });
    for (var j = 0; j < this.comets.length; j++) {
      var c = this.comets[j];
      var gx1 = c.x;
      var gy1 = c.y;
      var gx0 = c.x - c.length * Math.cos(c.angle);
      var gy0 = c.y - c.length * Math.sin(c.angle);
      var grad = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.7, 'rgba(200,220,255,' + (c.opacity * 0.6) + ')');
      grad.addColorStop(1, 'rgba(255,255,255,' + c.opacity + ')');
      ctx.beginPath();
      ctx.moveTo(gx0, gy0);
      ctx.lineTo(gx1, gy1);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1.2;
      ctx.globalAlpha = c.opacity;
      ctx.stroke();
      c.x      += c.speed * Math.cos(c.angle);
      c.y      += c.speed * Math.sin(c.angle);
      c.opacity -= 0.018;
    }

    ctx.globalAlpha = 1;
    this.raf = requestAnimationFrame(function () { self._render(); });
  };

  if (!prefersReduced) {
    new StarField(document.getElementById('starfield'));
  }

  function Cursor() {
    if (isTouch) return;
    this.dot      = document.querySelector('.cursor');
    this.follower = document.querySelector('.cursor-follower');
    if (!this.dot || !this.follower) return;
    this.mx = 0; this.my = 0;
    this.fx = 0; this.fy = 0;
    this._init();
  }

  Cursor.prototype._init = function () {
    var self = this;
    document.addEventListener('mousemove', function (e) {
      self.mx = e.clientX;
      self.my = e.clientY;
    }, { passive: true });
    document.addEventListener('mouseleave', function () {
      self.dot.style.opacity      = '0';
      self.follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      self.dot.style.opacity      = '1';
      self.follower.style.opacity = '1';
    });
    document.querySelectorAll('a, button, [role="button"]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        self.dot.classList.add('active');
        self.follower.classList.add('active');
      });
      el.addEventListener('mouseleave', function () {
        self.dot.classList.remove('active');
        self.follower.classList.remove('active');
      });
    });
    this._tick();
  };

  Cursor.prototype._tick = function () {
    var self = this;
    this.fx += (this.mx - this.fx) * 0.16;
    this.fy += (this.my - this.fy) * 0.16;
    this.dot.style.left      = this.mx + 'px';
    this.dot.style.top       = this.my + 'px';
    this.follower.style.left = this.fx + 'px';
    this.follower.style.top  = this.fy + 'px';
    requestAnimationFrame(function () { self._tick(); });
  };

  new Cursor();

  (function initMenu() {
    var toggle = document.getElementById('menuToggle');
    var menu   = document.getElementById('menuFullscreen');
    var close  = document.getElementById('menuClose');
    var links  = menu ? menu.querySelectorAll('.menu-link') : [];
    var focusable = menu ? menu.querySelectorAll('a, button, [tabindex]') : [];

    if (!toggle || !menu || !close) return;

    var open = false;

    function openMenu() {
      open = true;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('active');
      menu.setAttribute('aria-hidden', 'false');
      menu.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      open = false;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('active');
      menu.setAttribute('aria-hidden', 'true');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () { open ? closeMenu() : openMenu(); });
    close.addEventListener('click', closeMenu);

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        if (link.getAttribute('href').startsWith('#')) {
          closeMenu();
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') { closeMenu(); toggle.focus(); }
      if (e.key === 'Tab') {
        var arr   = Array.from(focusable);
        var first = arr[0];
        var last  = arr[arr.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  })();

  document.addEventListener('DOMContentLoaded', function () {

    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = entry.target.dataset.delay;
        if (delay) entry.target.style.transitionDelay = (parseInt(delay, 10) / 1000) + 's';
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObs.observe(el);
    });

    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || entry.target.dataset.counted) return;
        entry.target.dataset.counted = '1';
        var target   = parseFloat(entry.target.dataset.target);
        var isFloat  = target % 1 !== 0;
        var t0       = performance.now();
        var dur      = 1600;
        function tick(now) {
          var p   = Math.min((now - t0) / dur, 1);
          var val = (1 - Math.pow(1 - p, 3)) * target;
          entry.target.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
          if (p < 1) requestAnimationFrame(tick);
          else entry.target.textContent = isFloat ? target.toFixed(1) : target;
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(function (c) {
      counterObs.observe(c);
    });

    var perfObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || entry.target.dataset.animated) return;
        entry.target.dataset.animated = '1';
        var w = entry.target.dataset.width || '0';
        entry.target.style.width = w + '%';
        perfObs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.perf-bar-fill').forEach(function (bar) {
      perfObs.observe(bar);
    });

    var circObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var card    = entry.target;
        var prog    = card.querySelector('.circular-prog');
        var fill    = card.querySelector('.circ-fill');
        if (!prog || !fill) return;
        var pct     = parseFloat(prog.dataset.percent) || 0;
        var offset  = 251.2 - (251.2 * pct / 100);
        card.style.setProperty('--target-offset', offset);
        setTimeout(function () { fill.style.strokeDashoffset = offset; }, 120);
        circObs.unobserve(card);
      });
    }, { threshold: 0.35 });

    document.querySelectorAll('.metric-card').forEach(function (card) {
      circObs.observe(card);
    });

    if (!prefersReduced) {
      var heroImg = document.querySelector('.hero-media img');
      if (heroImg) {
        window.addEventListener('scroll', function () {
          if (window.scrollY < window.innerHeight) {
            heroImg.style.transform = 'translateY(' + (window.scrollY * 0.22) + 'px)';
          }
        }, { passive: true });
      }
    }

    var scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
      window.addEventListener('scroll', function () {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
      }, { passive: true });
      scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

  });

})();