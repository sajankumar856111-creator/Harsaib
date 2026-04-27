/* ========================================
   EMBER & ASH — MAIN JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------
  // CUSTOM CURSOR
  // ----------------------------------------
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Scale cursor on clickable elements
    const clickables = document.querySelectorAll('a, button, .tab, .gallery-item, .review-btn');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(2)');
      el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  }

  // ----------------------------------------
  // NAVIGATION — scroll + mobile toggle
  // ----------------------------------------
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  navToggle?.addEventListener('click', () => {
    console.log('Hello testing New changes');
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'translateY(6px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close nav on link click (mobile)
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle?.querySelectorAll('span');
      if (spans) {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  });

  // ----------------------------------------
  // REVEAL ON SCROLL (IntersectionObserver)
  // ----------------------------------------
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.parentElement?.querySelectorAll('.reveal');
        let delay = 0;
        if (siblings) {
          siblings.forEach((sib, idx) => {
            if (sib === entry.target) delay = idx * 80;
          });
        }
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // Trigger hero reveals immediately
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 300 + i * 150);
  });

  // ----------------------------------------
  // MENU TABS
  // ----------------------------------------
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) {
        panel.classList.add('active');
        // Animate items in
        const items = panel.querySelectorAll('.menu-item');
        items.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-15px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, i * 60);
        });
      }
    });
  });

  // ----------------------------------------
  // REVIEW CAROUSEL
  // ----------------------------------------
  const reviewCards = document.querySelectorAll('.review-card');
  const dotsContainer = document.getElementById('reviewDots');
  const prevBtn = document.getElementById('prevReview');
  const nextBtn = document.getElementById('nextReview');
  let currentReview = 0;
  let autoplayTimer = null;

  // Create dots
  reviewCards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot-pip');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToReview(i));
    dotsContainer?.appendChild(dot);
  });

  function goToReview(index) {
    reviewCards[currentReview]?.classList.remove('active');
    dotsContainer?.querySelectorAll('.dot-pip')[currentReview]?.classList.remove('active');
    currentReview = (index + reviewCards.length) % reviewCards.length;
    reviewCards[currentReview]?.classList.add('active');
    dotsContainer?.querySelectorAll('.dot-pip')[currentReview]?.classList.add('active');
  }

  prevBtn?.addEventListener('click', () => {
    goToReview(currentReview - 1);
    resetAutoplay();
  });

  nextBtn?.addEventListener('click', () => {
    goToReview(currentReview + 1);
    resetAutoplay();
  });

  // Show first card
  reviewCards[0]?.classList.add('active');

  // Autoplay
  function startAutoplay() {
    autoplayTimer = setInterval(() => goToReview(currentReview + 1), 5000);
  }
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }
  startAutoplay();

  // ----------------------------------------
  // RESERVATION FORM
  // ----------------------------------------
  const form = document.getElementById('reserveForm');
  const formSuccess = document.getElementById('formSuccess');

  // Set min date to today
  const dateInput = form?.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Processing...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.style.display = 'none';
      formSuccess.style.display = 'block';
      form.querySelectorAll('input, select, textarea').forEach(el => {
        el.disabled = true;
        el.style.opacity = '0.5';
      });
    }, 1500);
  });

  // ----------------------------------------
  // PARALLAX HERO GLOW
  // ----------------------------------------
  const glows = document.querySelectorAll('.hero-glow');
  window.addEventListener('mousemove', (e) => {
    const xFraction = e.clientX / window.innerWidth;
    const yFraction = e.clientY / window.innerHeight;
    glows.forEach((glow, i) => {
      const factor = (i + 1) * 15;
      const sign = i % 2 === 0 ? 1 : -1;
      glow.style.transform = `translate(${sign * xFraction * factor}px, ${sign * yFraction * factor}px)`;
    });
  });

  // ----------------------------------------
  // SMOOTH COUNTER ANIMATION (stats)
  // ----------------------------------------
  const statNums = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      statNums.forEach(el => {
        const target = parseInt(el.textContent.replace('+', ''), 10);
        const suffix = el.textContent.includes('+') ? '+' : '';
        let current = 0;
        const step = target / 50;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + suffix;
          if (current >= target) clearInterval(timer);
        }, 30);
      });
    }
  }, { threshold: 0.5 });

  const aboutStats = document.querySelector('.about-stats');
  if (aboutStats) statsObserver.observe(aboutStats);

  // ----------------------------------------
  // GALLERY TILT EFFECT
  // ----------------------------------------
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.02)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale(1)';
      item.style.transition = 'transform 0.5s ease';
    });
  });

  // ----------------------------------------
  // NAV ACTIVE LINK ON SCROLL
  // ----------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(a => a.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--cream)';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

});
