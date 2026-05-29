/* ==============================================
   APEX AUTO & TIRE CO. - JS
   ============================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupNavbar();
    setupMobileNav();
    setupScrollReveal();
    setupCounters();
    setupSpeedometer();
    setupForm();
  }

  /* --- Navbar scroll behavior --- */
  function setupNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Mobile nav toggle --- */
  function setupMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
    });

    // Close mobile nav when clicking a link
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
      });
    });
  }

  /* --- Scroll reveal animations --- */
  function setupScrollReveal() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Staggered reveal for grouped elements
            const parent = entry.target.parentElement;
            const siblings = parent ? parent.querySelectorAll('.reveal') : [entry.target];
            const index = Array.prototype.indexOf.call(siblings, entry.target);
            entry.target.style.transitionDelay = `${Math.min(index * 80, 400)}ms`;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* --- Animated number counters --- */
  function setupCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length || !('IntersectionObserver' in window)) {
      counters.forEach((el) => (el.textContent = formatCount(parseInt(el.dataset.count, 10))));
      return;
    }

    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      const duration = 1800;
      const start = performance.now();
      const startVal = 0;

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(startVal + (target - startVal) * eased);
        el.textContent = formatCount(value);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = formatCount(target);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  function formatCount(n) {
    if (n >= 1000) return n.toLocaleString('en-US');
    return String(n);
  }

  /* --- Speedometer needle animation --- */
  function setupSpeedometer() {
    const needle = document.getElementById('speedoNeedle');
    const arc = document.getElementById('speedoArc');
    if (!needle) return;

    // Continuous "racing" needle sweep - oscillates like the engine revving
    const minAngle = -90;
    const maxAngle = 90;
    let target = 40;
    let current = minAngle;
    let lastTime = performance.now();

    const pickTarget = () => {
      target = minAngle + Math.random() * (maxAngle - minAngle);
      setTimeout(pickTarget, 800 + Math.random() * 1200);
    };
    pickTarget();

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      // Smoothly move current toward target
      current += (target - current) * Math.min(dt * 4, 1);
      needle.setAttribute('transform', `translate(70 100) rotate(${current})`);

      if (arc) {
        const progress = (current - minAngle) / (maxAngle - minAngle);
        const dashLength = 220;
        arc.setAttribute('stroke-dashoffset', String(dashLength - dashLength * progress));
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  /* --- Booking form --- */
  function setupForm() {
    const form = document.getElementById('bookingForm');
    const success = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation - check required fields
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach((field) => {
        if (!field.value.trim()) {
          field.style.borderColor = '#E10600';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        return;
      }

      // Show success message
      if (success) {
        success.classList.add('show');
        form.reset();
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          success.classList.remove('show');
        }, 8000);
      }
    });

    // Clear red border when typing
    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('input', () => {
        if (field.value.trim()) field.style.borderColor = '';
      });
    });

    // Set min date to today
    const dateInput = document.getElementById('preferred');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }
  }
})();
