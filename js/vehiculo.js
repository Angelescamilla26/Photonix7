import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

(() => {
  'use strict';

  const initCursor = () => {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    }, { passive: true });

    const tick = () => {
      fx += (mx - fx) * 0.1;
      fy += (my - fy) * 0.1;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(tick);
    };
    tick();

    document.querySelectorAll('a, button, .btn, .team-card, .sponsor-card, .perf-card, .metric-card, .gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('active'); follower.classList.add('active'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('active'); follower.classList.remove('active'); });
    });
  };

  const initMenu = () => {
    const toggle = document.getElementById('menuToggle');
    const fullscreen = document.getElementById('menuFullscreen');
    const closeBtn = document.getElementById('menuClose');
    if (!toggle || !fullscreen) return;

    const open = () => { toggle.classList.add('active'); fullscreen.classList.add('active'); toggle.setAttribute('aria-expanded', 'true'); fullscreen.setAttribute('aria-hidden', 'false'); };
    const close = () => { toggle.classList.remove('active'); fullscreen.classList.remove('active'); toggle.setAttribute('aria-expanded', 'false'); fullscreen.setAttribute('aria-hidden', 'true'); };

    toggle.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);

    fullscreen.querySelectorAll('.menu-link').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          close();
          const target = document.querySelector(href);
          if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
        } else {
          close();
        }
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && fullscreen.classList.contains('active')) close();
    });
  };

  const initScrollTop = () => {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const initReveal = () => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(el => obs.observe(el));
  };

  const initCounters = () => {
    const counters = document.querySelectorAll('.veh-counter');
    if (!counters.length) return;
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target.dataset.done) return;
        entry.target.dataset.done = '1';
        const target = parseFloat(entry.target.dataset.target);
        const isFloat = target % 1 !== 0;
        const duration = 1400;
        const start = performance.now();
        const tick = now => {
          const progress = Math.min((now - start) / duration, 1);
          const val = easeOut(progress) * target;
          entry.target.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
          if (progress < 1) requestAnimationFrame(tick);
          else entry.target.textContent = target;
        };
        requestAnimationFrame(tick);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  };

  const initModel = () => {
    const container = document.getElementById('modelContainer');
    const placeholder = document.getElementById('modelPlaceholder');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080814);
    scene.fog = new THREE.FogExp2(0x080814, 0.035);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(5, 2.5, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.enableZoom = true;
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI * 0.8;
    controls.target.set(0, 0.5, 0);

    const ambient = new THREE.AmbientLight(0x202040, 1.2);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    scene.add(keyLight);

    const fillBlue = new THREE.PointLight(0x0080ff, 1.2, 20);
    fillBlue.position.set(-5, 2, 4);
    scene.add(fillBlue);

    const rimRed = new THREE.PointLight(0xe30613, 0.8, 18);
    rimRed.position.set(4, 1, -5);
    scene.add(rimRed);

    const groundLight = new THREE.PointLight(0x0040aa, 0.4, 10);
    groundLight.position.set(0, -1, 0);
    scene.add(groundLight);

    const gridHelper = new THREE.GridHelper(14, 28, 0x1a3366, 0x0d1a33);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    const floorGeo = new THREE.PlaneGeometry(14, 14);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050510,
      roughness: 0.9,
      metalness: 0.1,
      transparent: true,
      opacity: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.51;
    floor.receiveShadow = true;
    scene.add(floor);

    const loadFallback = () => {
      const loader = new OBJLoader();
      loader.setPath('/models/');
      loader.load('*.obj', obj => {
        obj.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xdddddd,
              roughness: 0.35,
              metalness: 0.7,
              emissive: new THREE.Color(0x050510),
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        obj.scale.set(0.5, 0.5, 0.5);
        obj.position.y = 0;
        scene.add(obj);
        placeholder?.classList.add('hidden');
      }, undefined, err => console.error('OBJ load failed:', err));
    };

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('/models/');
    mtlLoader.load('Photonix7.mtl', materials => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('/models/');
      objLoader.load('Photonix7.obj', obj => {
        obj.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        obj.scale.set(0.5, 0.5, 0.5);
        obj.position.y = 0;
        scene.add(obj);
        placeholder?.classList.add('hidden');
      }, undefined, loadFallback);
    }, undefined, loadFallback);

    let animFrameId;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      controls.update();
      const t = performance.now() * 0.001;
      fillBlue.intensity = 1.2 + Math.sin(t * 0.8) * 0.3;
      rimRed.intensity = 0.8 + Math.sin(t * 0.6 + 1) * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize, { passive: true });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animFrameId) animate();
        } else {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      });
    }, { threshold: 0.1 });
    obs.observe(container);

    container.addEventListener('mouseenter', () => { controls.autoRotate = false; });
    container.addEventListener('mouseleave', () => { controls.autoRotate = true; });
    container.addEventListener('touchstart', () => { controls.autoRotate = false; }, { passive: true });
    container.addEventListener('touchend', () => { setTimeout(() => { controls.autoRotate = true; }, 3000); }, { passive: true });
  };

  const init = () => {
    initCursor();
    initMenu();
    initScrollTop();
    initReveal();
    initCounters();
    initModel();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();