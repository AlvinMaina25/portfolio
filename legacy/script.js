/**
 * ALVIN MAINA PORTFOLIO — script.js
 * Dark Futuristic | Cybersecurity + AI Aesthetic
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   1. LOADING SCREEN
═══════════════════════════════════════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById('loader');
  const loaderText = document.getElementById('loaderText');

  const messages = [
    'INITIALIZING SYSTEMS...',
    'LOADING SECURITY MODULES...',
    'ESTABLISHING SECURE CONNECTION...',
    'DECRYPTING PORTFOLIO DATA...',
    'READY.'
  ];

  let msgIdx = 0;
  const msgInterval = setInterval(() => {
    msgIdx++;
    if (msgIdx < messages.length && loaderText) {
      loaderText.textContent = messages[msgIdx];
    }
    if (msgIdx >= messages.length - 1) {
      clearInterval(msgInterval);
    }
  }, 400);

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        // Start reveal animations after loader hides
        initScrollReveal();
        initCounters();
        initSkillBars();
      }
    }, 2200);
  });

  document.body.classList.add('loading');
})();


/* ═══════════════════════════════════════════════════════════════
   2. CUSTOM CURSOR
═══════════════════════════════════════════════════════════════ */
(function initCursor() {
  const glow = document.getElementById('cursorGlow');
  const dot = document.getElementById('cursorDot');
  if (!glow || !dot) return;

  // Don't show custom cursor on touch devices
  if ('ontouchstart' in window) return;

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smooth glow follows with lag
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, .skill-card, .project-card, .cert-card, .learning-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove('hovering');
    }
  });
})();


/* ═══════════════════════════════════════════════════════════════
   3. PARTICLE / CYBER BACKGROUND
═══════════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const PARTICLE_COUNT = window.innerWidth > 768 ? 80 : 30;
  const MAX_DIST = 160;
  const BLUE = '26, 111, 255';
  const GOLD = '201, 162, 39';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.5;
      this.color = Math.random() > 0.7 ? GOLD : BLUE;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    }
    draw() {
      const o = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${o})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${BLUE}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  init();
  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { init(); }, 250);
  });
})();


/* ═══════════════════════════════════════════════════════════════
   4. NAVIGATION
═══════════════════════════════════════════════════════════════ */
(function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navProgress = document.getElementById('navProgress');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll behavior: sticky nav + progress bar
  function onScroll() {
    const scrolled = window.scrollY;

    // Scrolled class for background blur
    if (scrolled > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Progress bar
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / docH) * 100;
    if (navProgress) navProgress.style.width = progress + '%';

    // Active section highlight
    let currentSection = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (scrolled >= top) {
        currentSection = section.id;
      }
    });

    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger menu
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  // Close menu on nav link click
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Back to top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();


/* ═══════════════════════════════════════════════════════════════
   5. TYPING TEXT EFFECT
═══════════════════════════════════════════════════════════════ */
(function initTypingEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const words = [
    'Cybersecurity Engineer',
    'AI Developer',
    'Full-Stack Developer',
    'Cloud & Software Engineer'
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  const TYPING_SPEED = 80;
  const DELETING_SPEED = 40;
  const PAUSE_AFTER_WORD = 1800;
  const PAUSE_BEFORE_TYPE = 400;

  function type() {
    const current = words[wordIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(type, PAUSE_BEFORE_TYPE);
        return;
      }
      setTimeout(type, DELETING_SPEED);
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(type, PAUSE_AFTER_WORD);
        return;
      }
      setTimeout(type, TYPING_SPEED);
    }
  }

  // Start after loader
  setTimeout(type, 2600);
})();


/* ═══════════════════════════════════════════════════════════════
   6. SCROLL REVEAL ANIMATIONS
═══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger delay for siblings
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(el => el.classList.contains('reveal-up') ||
                        el.classList.contains('reveal-left') ||
                        el.classList.contains('reveal-right'));
        const index = siblings.indexOf(entry.target);
        const delay = Math.min(index * 80, 400);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}


/* ═══════════════════════════════════════════════════════════════
   7. ANIMATED COUNTERS
═══════════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current);
        }, 16);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}


/* ═══════════════════════════════════════════════════════════════
   8. SKILL BARS ANIMATION
═══════════════════════════════════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill, .lcp-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.dataset.width;
        // Small delay so CSS transition fires
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 100);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}


/* ═══════════════════════════════════════════════════════════════
   9. SKILL CARD FILTERING
═══════════════════════════════════════════════════════════════ */
(function initSkillFilter() {
  const filters = document.querySelectorAll('.skill-filter');
  const cards = document.querySelectorAll('.skill-card');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          // Re-animate reveal
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();


/* ═══════════════════════════════════════════════════════════════
   10. PROJECT CARD FILTERING
═══════════════════════════════════════════════════════════════ */
(function initProjectFilter() {
  const filters = document.querySelectorAll('.proj-filter');
  const cards = document.querySelectorAll('.project-card');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.projectCat;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();


/* ═══════════════════════════════════════════════════════════════
   11. CONTACT FORM — WORLD-CLASS UPGRADE
   ─────────────────────────────────────────────────────────────
   Features:
   ✅ WhatsApp floating FAB with pulse ring animation
   ✅ Inline WhatsApp button as send-failure fallback
   ✅ Real form submission via Formspree (replace YOUR_FORM_ID)
   ✅ Availability badge (green / red)
   ✅ Topic chips that pre-fill a hidden subject field
   ✅ Live character counter on textarea
   ✅ One-click copy for email / phone (data-copy attribute)
   ✅ Honeypot anti-spam field support
   ✅ Graceful error state with WhatsApp escape hatch

   ── QUICK SETUP ──────────────────────────────────────────────
   1. Set CONFIG.whatsappNumber  → your number without "+" e.g. 254712345678
   2. Set CONFIG.formspreeEndpoint → sign up at formspree.io, get your form ID
   3. Set CONFIG.emailAddress    → your real email
   4. Set CONFIG.availableForWork → true / false
   5. Add the HTML snippets below into your contact section
═══════════════════════════════════════════════════════════════ */
(function initContactForm() {

  /* ── CONFIG ─────────────────────────────────────────────── */
  const CONFIG = {
    whatsappNumber:     '254112795827',   // ← YOUR number (no + sign)
    whatsappDefaultMsg: 'Hi Alvin! I found your portfolio and would love to connect.',
    formspreeEndpoint:  'https://formspree.io/f/YOUR_FORM_ID', // ← replace
    emailAddress:       'alvinmaina2505@gmail.com',  // ← replace
    availableForWork:   true,             // toggle the availability badge
    maxMessageLength:   500,
  };

  /* ── 1. AVAILABILITY BADGE ─────────────────────────────── */
  const badge = document.getElementById('availabilityBadge');
  if (badge) {
    badge.textContent = CONFIG.availableForWork
      ? '🟢 Available for new projects'
      : '🔴 Currently unavailable';
    badge.classList.add(CONFIG.availableForWork ? 'available' : 'unavailable');
  }

  /* ── 2. WHATSAPP HELPERS ───────────────────────────────── */
  function openWhatsApp(customMsg) {
    const msg = encodeURIComponent(customMsg || CONFIG.whatsappDefaultMsg);
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    // Micro-interaction: shrink-bounce the FAB
    const fab = document.getElementById('whatsappFab');
    if (fab) {
      fab.classList.add('clicked');
      setTimeout(() => fab.classList.remove('clicked'), 600);
    }
  }

  /* ── 3. FLOATING WHATSAPP BUTTON (FAB) ─────────────────── */
  // Creates the FAB if it isn't already in HTML
  if (!document.getElementById('whatsappFab')) {
    const fab = document.createElement('button');
    fab.id = 'whatsappFab';
    fab.setAttribute('aria-label', 'Chat on WhatsApp');
    fab.title = 'Chat on WhatsApp';
    fab.innerHTML = `
      <span class="wa-pulse"></span>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
          -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463
          -2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606
          .134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371
          -.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51
          -.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016
          -1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487
          .709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719
          2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m
          -5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998
          -3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888
          -9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003
          5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495
          0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654
          a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893
          a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>`;
    fab.addEventListener('click', () => openWhatsApp());
    document.body.appendChild(fab);

    // Inject required FAB + badge + chip + counter CSS dynamically
    // (Remove this block if you paste the CSS into your stylesheet instead)
    if (!document.getElementById('waFabStyles')) {
      const style = document.createElement('style');
      style.id = 'waFabStyles';
      style.textContent = `
        /* ── WhatsApp FAB ── */
        #whatsappFab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 9999;
          width: 58px;
          height: 58px;
          background: #25D366;
          color: #fff;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(37,211,102,0.45);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        #whatsappFab:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 28px rgba(37,211,102,0.6);
        }
        #whatsappFab.clicked { transform: scale(0.92); }
        .wa-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(37,211,102,0.4);
          animation: waPulse 2.2s ease-out infinite;
          pointer-events: none;
        }
        @keyframes waPulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.7); opacity: 0;   }
          100% { opacity: 0; }
        }

        /* ── Availability Badge ── */
        #availabilityBadge {
          display: inline-block;
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          margin-bottom: 1.5rem;
        }
        #availabilityBadge.available {
          background: rgba(37,211,102,0.12);
          color: #25D366;
          border: 1px solid rgba(37,211,102,0.3);
        }
        #availabilityBadge.unavailable {
          background: rgba(255,80,80,0.12);
          color: #ff5050;
          border: 1px solid rgba(255,80,80,0.3);
        }

        /* ── Topic Chips ── */
        .topic-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .topic-chip {
          padding: 0.3rem 0.85rem;
          border-radius: 999px;
          border: 1px solid rgba(26,111,255,0.35);
          background: transparent;
          color: #aaa;
          font-size: 0.78rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .topic-chip:hover,
        .topic-chip.active {
          background: rgba(26,111,255,0.15);
          border-color: #1a6fff;
          color: #1a6fff;
        }

        /* ── Character Counter ── */
        .char-counter {
          display: block;
          text-align: right;
          font-size: 0.72rem;
          color: #777;
          margin-top: 0.25rem;
          transition: color 0.2s;
        }
        .char-counter.near-limit { color: #e8a000; }

        /* ── Copy-to-clipboard ── */
        [data-copy] { cursor: pointer; transition: color 0.2s; }
        [data-copy]:hover { color: #1a6fff; }
        [data-copy].copied { color: #25D366; }

        /* ── Inline WhatsApp Button ── */
        #whatsappContactBtn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1.1rem;
          background: #25D366;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          font-family: inherit;
          text-decoration: none;
          flex-shrink: 0;
        }
        #whatsappContactBtn:hover {
          background: #1ebe5b;
          transform: translateY(-2px);
        }

        /* ── Form Error block ── */
        #formError {
          display: none;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding: 1rem 1.25rem;
          border-radius: 8px;
          background: rgba(255,80,80,0.1);
          border: 1px solid rgba(255,80,80,0.25);
          color: #ff5050;
          font-size: 0.875rem;
          margin-top: 1rem;
        }
      `;
      document.head.appendChild(style);
    }
  } else {
    document.getElementById('whatsappFab').addEventListener('click', () => openWhatsApp());
  }

  /* ── 4. INLINE WHATSAPP BUTTON (inside contact section) ─── */
  const waBtn = document.getElementById('whatsappContactBtn');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const name = document.getElementById('contactName')?.value.trim();
      const msg = name
        ? `Hi Alvin! I'm ${name} and I found your portfolio. Would love to connect.`
        : CONFIG.whatsappDefaultMsg;
      openWhatsApp(msg);
    });
  }

  /* ── 5. TOPIC CHIPS ────────────────────────────────────── */
  const chips = document.querySelectorAll('.topic-chip');
  const subjectInput = document.getElementById('contactSubject');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (subjectInput) subjectInput.value = chip.dataset.topic;
    });
  });

  /* ── 6. CHARACTER COUNTER ──────────────────────────────── */
  const msgInput  = document.getElementById('contactMessage');
  const charCount = document.getElementById('charCount');
  if (msgInput && charCount) {
    msgInput.setAttribute('maxlength', CONFIG.maxMessageLength);
    charCount.textContent = `0 / ${CONFIG.maxMessageLength}`;
    msgInput.addEventListener('input', () => {
      const len = msgInput.value.length;
      charCount.textContent = `${len} / ${CONFIG.maxMessageLength}`;
      charCount.classList.toggle('near-limit', len > CONFIG.maxMessageLength * 0.85);
    });
  }

  /* ── 7. COPY-TO-CLIPBOARD ──────────────────────────────── */
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
      navigator.clipboard.writeText(el.dataset.copy).then(() => {
        const orig = el.innerHTML;
        el.innerHTML = '✓ Copied!';
        el.classList.add('copied');
        setTimeout(() => {
          el.innerHTML = orig;
          el.classList.remove('copied');
        }, 2000);
      });
    });
  });

  /* ── 8. FORM VALIDATION + REAL SUBMISSION ──────────────── */
  const form       = document.getElementById('contactForm');
  if (!form) return;

  const nameInput  = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const nameError  = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const msgError   = document.getElementById('messageError');
  const submitBtn  = document.getElementById('submitBtn');
  const formSuccess= document.getElementById('formSuccess');
  const formError  = document.getElementById('formError');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function setError(input, errorEl, message) {
    if (input)   input.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }
  function clearError(input, errorEl) {
    if (input)   input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  }

  // Live validation
  nameInput?.addEventListener('input',  () => {
    if (nameInput.value.trim().length >= 2)         clearError(nameInput,  nameError);
  });
  emailInput?.addEventListener('input', () => {
    if (validateEmail(emailInput.value.trim()))      clearError(emailInput, emailError);
  });
  msgInput?.addEventListener('input',   () => {
    if (msgInput.value.trim().length >= 10)          clearError(msgInput,   msgError);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    const name    = nameInput?.value.trim()  ?? '';
    const email   = emailInput?.value.trim() ?? '';
    const message = msgInput?.value.trim()   ?? '';

    clearError(nameInput,  nameError);
    clearError(emailInput, emailError);
    clearError(msgInput,   msgError);
    if (formError) formError.style.display = 'none';

    if (name.length < 2)       { setError(nameInput,  nameError,  'Name must be at least 2 characters');  valid = false; }
    if (!validateEmail(email)) { setError(emailInput, emailError, 'Please enter a valid email address');   valid = false; }
    if (message.length < 10)   { setError(msgInput,   msgError,   'Message must be at least 10 characters'); valid = false; }
    if (!valid) return;

    // Loading state
    const btnText   = submitBtn?.querySelector('.btn-text');
    const btnLoader = submitBtn?.querySelector('.btn-loader');
    if (btnText)   btnText.style.display   = 'none';
    if (btnLoader) btnLoader.style.display = 'inline';
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch(CONFIG.formspreeEndpoint, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(form),
      });

      if (res.ok) {
        // ✅ Success
        if (formSuccess) {
          formSuccess.style.display = 'flex';
          setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
        }
        form.reset();
        chips.forEach(c => c.classList.remove('active'));
        if (charCount) charCount.textContent = `0 / ${CONFIG.maxMessageLength}`;
      } else {
        throw new Error('Server error');
      }
    } catch {
      // ❌ Fallback — show error block with WhatsApp escape hatch
      if (formError) formError.style.display = 'flex';
    }

    if (btnText)   btnText.style.display   = 'inline';
    if (btnLoader) btnLoader.style.display = 'none';
    if (submitBtn) submitBtn.disabled = false;
  });

})();

/*
 ═══════════════════════════════════════════════════════════════
  HTML SNIPPETS — add these to your contact section in index.html
 ═══════════════════════════════════════════════════════════════

  <!-- Availability badge (goes near the section heading) -->
  <span id="availabilityBadge"></span>

  <!-- Topic chips (goes above the message textarea) -->
  <div class="topic-chips" role="group" aria-label="Message topic">
    <button type="button" class="topic-chip" data-topic="Freelance Project">Freelance Project</button>
    <button type="button" class="topic-chip" data-topic="Full-Time Role">Full-Time Role</button>
    <button type="button" class="topic-chip" data-topic="Collaboration">Collaboration</button>
    <button type="button" class="topic-chip" data-topic="Just Saying Hi">Just Saying Hi 👋</button>
  </div>

  <!-- Hidden subject field (auto-filled by chips) -->
  <input type="hidden" id="contactSubject" name="subject">

  <!-- Honeypot anti-spam (MUST be hidden with CSS display:none) -->
  <input type="text" name="_gotcha" tabindex="-1" aria-hidden="true" style="display:none">

  <!-- Character counter — place immediately after your <textarea> -->
  <span class="char-counter" id="charCount" aria-live="polite"></span>

  <!-- Form error block with WhatsApp fallback -->
  <div id="formError" role="alert">
    <span>⚠️ Message failed to send. Try WhatsApp instead:</span>
    <button type="button" id="whatsappContactBtn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Chat on WhatsApp
    </button>
  </div>

  <!-- Copy-to-clipboard links (example — update with your real details) -->
  <span data-copy="alvin@example.com" title="Click to copy">📧 alvin@example.com</span>
  <span data-copy="+254700000000"     title="Click to copy">📞 +254 700 000 000</span>
*/


/* ═══════════════════════════════════════════════════════════════
   12. SMOOTH SCROLL FOR ALL ANCHOR LINKS
═══════════════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height'));
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 10;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();


/* ═══════════════════════════════════════════════════════════════
   13. DOWNLOAD RESUME
═══════════════════════════════════════════════════════════════ */
(function initDownloadResume() {
  const btn = document.getElementById('downloadResume');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // In a real deployment, replace with the actual resume URL
    const resumeUrl = '#';
    if (resumeUrl !== '#') {
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'Alvin_Maina_Resume.pdf';
      link.click();
    } else {
      // Placeholder feedback
      btn.textContent = '↓ Coming Soon';
      setTimeout(() => {
        btn.innerHTML = '<span class="btn-icon">&#8681;</span> Download CV';
      }, 2000);
    }
  });
})();


/* ═══════════════════════════════════════════════════════════════
   14. HERO CARD TILT (Desktop only)
═══════════════════════════════════════════════════════════════ */
(function initCardTilt() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('.project-card, .skill-card, .cert-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * 4;
      const tiltY = ((cx - x) / cx) * 4;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ═══════════════════════════════════════════════════════════════
   15. GLITCH EFFECT ON HERO NAME (subtle)
═══════════════════════════════════════════════════════════════ */
(function initGlitch() {
  const nameLast = document.querySelector('.name-last');
  if (!nameLast) return;

  function glitch() {
    nameLast.style.textShadow = `
      ${(Math.random() - 0.5) * 6}px 0 rgba(26,111,255,0.7),
      ${(Math.random() - 0.5) * 6}px 0 rgba(201,162,39,0.5)
    `;
    setTimeout(() => {
      nameLast.style.textShadow = '';
    }, 100);
  }

  // Random subtle glitch
  setInterval(() => {
    if (Math.random() > 0.85) glitch();
  }, 3000);
})();


/* ═══════════════════════════════════════════════════════════════
   16. PERFORMANCE: Pause particles on tab hidden
═══════════════════════════════════════════════════════════════ */
(function initVisibilityOptimization() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  document.addEventListener('visibilitychange', () => {
    canvas.style.opacity = document.hidden ? '0' : '0.55';
  });
})();


/* ═══════════════════════════════════════════════════════════════
   17. INIT ALL ON DOMCONTENTLOADED (fallback if load doesn't fire)
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // These are also called after loader, but initialize here as fallback
  setTimeout(() => {
    initScrollReveal();
    initCounters();
    initSkillBars();
  }, 2400);

  // Add class to reveal hero elements
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120 + 200);
    });
  }, 2300);
});