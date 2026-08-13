/* ═══════════════════════════════════════════
   NΞON VOID — MAIN JAVASCRIPT
   Particles · Nav · Modals · Forms · FAQ · Filters
═══════════════════════════════════════════ */

'use strict';

/* ── PARTICLES ───────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const COLORS = ['#00f5ff', '#9d00ff', '#ff00ff', '#ff2d78', '#00ff88'];
  const COUNT  = Math.min(80, Math.floor(window.innerWidth / 18));

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x:     randomBetween(0, W),
      y:     randomBetween(0, H),
      vx:    randomBetween(-0.3, 0.3),
      vy:    randomBetween(-0.5, -0.1),
      r:     randomBetween(0.8, 2.2),
      alpha: randomBetween(0.2, 0.6),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10)  { p.y = H + 10; p.x = randomBetween(0, W); }
      if (p.x < -10)  { p.x = W + 10; }
      if (p.x > W+10) { p.x = -10; }
    });
  }

  let rafId;
  function loop() {
    update();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
    cancelAnimationFrame(rafId);
    loop();
  });

  init();
  loop();
})();


/* ── NAVBAR ──────────────────────────────── */
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;

  // Scroll: add class + active link highlighting
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle('scrolled', scrolled);

    // Back to top
    const btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }, { passive: true });

  // Mobile hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', open);
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    // Close on nav link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Back to top button
  const btt = document.getElementById('backToTop');
  if (btt) {
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();


/* ── COUNTER ANIMATION ───────────────────── */
(function initCounters() {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (!statNums.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1800;
      const start  = performance.now();

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();


/* ── SCROLL REVEAL ───────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll(
    '.post-card, .support-card, .faq-item, .comment-item, .section-header, .contact-info, .contact-form, .status-board'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();


/* ── POST FILTERS ────────────────────────── */
(function initFilters() {
  const tabs      = document.querySelectorAll('.filter-tab');
  const cards     = document.querySelectorAll('.post-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
})();


/* ── LOAD MORE ───────────────────────────── */
(function initLoadMore() {
  const btn = document.getElementById('loadMoreBtn');
  if (!btn) return;
  let loaded = false;

  btn.addEventListener('click', () => {
    if (loaded) return;
    loaded = true;
    btn.textContent = 'Loading...';
    btn.disabled = true;

    setTimeout(() => {
      const grid = document.getElementById('postsGrid');
      const extras = [
        { cat: 'tech',     tag: 'Tech',     color: 'tag-tech',     title: 'The Hardware Arms Race',                  excerpt: 'GPU manufacturers are locked in a generational battle that will shape the next decade of computing.', author: 'SYS_NULL',       date: 'Jul 20, 2026' },
        { cat: 'security', tag: 'Security', color: 'tag-security', title: 'Social Engineering in 2026',              excerpt: 'The most sophisticated attacks still exploit the most ancient vulnerability: human trust.',              author: 'NΞON_WOLF',      date: 'Jul 17, 2026' },
        { cat: 'ai',       tag: 'AI',       color: 'tag-ai',       title: 'Emergent Behavior at Scale',              excerpt: 'Researchers are documenting capabilities in large models that nobody programmed — and nobody fully understands.', author: 'CIRCUIT_SAGE', date: 'Jul 14, 2026' },
      ];

      extras.forEach(p => {
        const article = document.createElement('article');
        article.className = 'post-card reveal';
        article.dataset.category = p.cat;
        article.innerHTML = `
          <div class="post-card-glow"></div>
          <div class="post-tag ${p.color}">${p.tag}</div>
          <h3 class="post-title">${p.title}</h3>
          <p class="post-excerpt">${p.excerpt}</p>
          <div class="post-meta">
            <span class="post-author">// ${p.author}</span>
            <span class="post-date">${p.date}</span>
          </div>
          <a href="post.html" class="post-read-more">Read More →</a>
        `;
        grid.appendChild(article);

        // Trigger reveal
        requestAnimationFrame(() => {
          requestAnimationFrame(() => article.classList.add('visible'));
        });
      });

      btn.textContent = 'No More Posts';
      btn.disabled = true;
      btn.style.opacity = '0.4';
    }, 800);
  });
})();


/* ── FAQ ─────────────────────────────────── */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.dataset.open === 'true';
      // Close all
      items.forEach(i => { i.dataset.open = 'false'; i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false'); });
      // Open clicked (unless it was already open)
      if (!isOpen) {
        item.dataset.open = 'true';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* ── VALIDATION HELPERS ──────────────────── */
function validateEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function setError(fieldId, errorId, msg) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field)  field.style.borderColor = msg ? '#ff2d78' : '';
  if (error)  error.textContent = msg || '';
}

function clearErrors(...errorIds) {
  errorIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}


/* ── TOAST ───────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
}


/* ── MODAL SYSTEM ────────────────────────── */
(function initModals() {
  const loginModal  = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');
  if (!loginModal || !signupModal) return;

  function openModal(modal) {
    modal.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('visible')));
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 200);
  }

  function closeModal(modal) {
    modal.classList.remove('visible');
    setTimeout(() => { modal.hidden = true; }, 300);
    document.body.style.overflow = '';
  }

  function closeAll() { closeModal(loginModal); closeModal(signupModal); }

  // Open triggers
  document.getElementById('loginBtn')?.addEventListener('click', () => openModal(loginModal));
  document.getElementById('signupBtn')?.addEventListener('click', () => openModal(signupModal));
  document.getElementById('heroSignupBtn')?.addEventListener('click', () => openModal(signupModal));

  // Close via overlay click
  [loginModal, signupModal].forEach(modal => {
    modal.addEventListener('click', e => { if (e.target === modal) closeAll(); });
  });

  // Close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeAll);
  });

  // Switch between modals
  document.getElementById('switchToSignup')?.addEventListener('click', () => {
    closeModal(loginModal);
    setTimeout(() => openModal(signupModal), 200);
  });
  document.getElementById('switchToLogin')?.addEventListener('click', () => {
    closeModal(signupModal);
    setTimeout(() => openModal(loginModal), 200);
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAll();
  });

  /* ── LOGIN FORM ── */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors('loginEmailError', 'loginPasswordError');
      let valid = true;

      const email = document.getElementById('loginEmail')?.value.trim() || '';
      const pass  = document.getElementById('loginPassword')?.value || '';

      if (!email) { setError('loginEmail', 'loginEmailError', 'Enter your email'); valid = false; }
      else if (!validateEmail(email)) { setError('loginEmail', 'loginEmailError', 'Enter a valid email'); valid = false; }
      if (!pass) { setError('loginPassword', 'loginPasswordError', 'Enter your password'); valid = false; }

      if (!valid) return;

      const btn = loginForm.querySelector('button[type="submit"]');
      btn.textContent = 'Authenticating...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'Access Granted';
        btn.disabled = false;
        const success = document.getElementById('loginSuccess');
        if (success) success.textContent = '✓ Welcome back. Logged in.';
        showToast('// ACCESS GRANTED — Welcome back');
        setTimeout(() => closeAll(), 1400);
      }, 1000);
    });
  }

  /* ── SIGNUP FORM ── */
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    // Password strength indicator
    const passInput = document.getElementById('signupPassword');
    const strengthEl = document.getElementById('passwordStrength');
    if (passInput && strengthEl) {
      passInput.addEventListener('input', () => {
        const val = passInput.value;
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;
        const levels = [
          '',
          { label: 'Weak',   color: '#ff2d78' },
          { label: 'Fair',   color: '#f5ff00' },
          { label: 'Good',   color: '#00f5ff' },
          { label: 'Strong', color: '#00ff88' },
        ];
        const lvl = levels[score];
        if (val.length === 0) { strengthEl.textContent = ''; return; }
        strengthEl.textContent   = `Strength: ${lvl.label}`;
        strengthEl.style.color   = lvl.color;
      });
    }

    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors('signupHandleError', 'signupEmailError', 'signupPasswordError');
      let valid = true;

      const handle = document.getElementById('signupHandle')?.value.trim() || '';
      const email  = document.getElementById('signupEmail')?.value.trim() || '';
      const pass   = document.getElementById('signupPassword')?.value || '';

      if (!handle)        { setError('signupHandle', 'signupHandleError', 'Choose a handle'); valid = false; }
      if (!email)         { setError('signupEmail',  'signupEmailError',  'Enter your email'); valid = false; }
      else if (!validateEmail(email)) { setError('signupEmail', 'signupEmailError', 'Enter a valid email'); valid = false; }
      if (!pass)          { setError('signupPassword', 'signupPasswordError', 'Create a password'); valid = false; }
      else if (pass.length < 8) { setError('signupPassword', 'signupPasswordError', 'Minimum 8 characters'); valid = false; }

      if (!valid) return;

      const btn = signupForm.querySelector('button[type="submit"]');
      btn.textContent = 'Creating identity...';
      btn.disabled = true;

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Create Account';
        const success = document.getElementById('signupSuccess');
        if (success) success.textContent = '✓ Account created. Check your email.';
        showToast('// IDENTITY CREATED — Check your email to confirm');
        setTimeout(() => closeAll(), 2000);
      }, 1200);
    });
  }
})();


/* ── COMMENT FORM ────────────────────────── */
(function initCommentForm() {
  const form = document.getElementById('commentForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors('commentNameError', 'commentEmailError', 'commentTextError');
    let valid = true;

    const name  = document.getElementById('commentName')?.value.trim() || '';
    const email = document.getElementById('commentEmail')?.value.trim() || '';
    const text  = document.getElementById('commentText')?.value.trim() || '';

    if (!name)  { setError('commentName',  'commentNameError',  'Enter a handle'); valid = false; }
    if (!email) { setError('commentEmail', 'commentEmailError', 'Enter your email'); valid = false; }
    else if (!validateEmail(email)) { setError('commentEmail', 'commentEmailError', 'Invalid email'); valid = false; }
    if (!text)  { setError('commentText',  'commentTextError',  'Write something'); valid = false; }
    else if (text.length < 10) { setError('commentText', 'commentTextError', 'Too short — say more'); valid = false; }

    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Transmitting...';
    btn.disabled = true;

    setTimeout(() => {
      // Add comment to list
      const list       = document.getElementById('commentsList');
      const countEl    = document.getElementById('commentCount');
      const initials   = name.slice(0, 2).toUpperCase();
      const commentEl  = document.createElement('div');
      commentEl.className = 'comment-item reveal';
      commentEl.innerHTML = `
        <div class="comment-avatar" aria-hidden="true">${initials}</div>
        <div class="comment-body">
          <div class="comment-header">
            <span class="comment-author">${escapeHtml(name)}</span>
            <span class="comment-time">Just now</span>
          </div>
          <p class="comment-text">${escapeHtml(text)}</p>
          <button class="comment-like" aria-label="Like this comment"><span>♦</span> 0</button>
        </div>
      `;
      list.appendChild(commentEl);
      requestAnimationFrame(() => requestAnimationFrame(() => commentEl.classList.add('visible')));

      // Update count
      if (countEl) {
        const cur = parseInt(countEl.textContent.replace(/\D/g, ''), 10);
        countEl.textContent = `(${cur + 1})`;
      }

      // Attach like handler
      commentEl.querySelector('.comment-like')?.addEventListener('click', function () {
        const num = parseInt(this.textContent.replace(/\D/g, ''), 10);
        this.innerHTML = `<span>♦</span> ${num + 1}`;
        this.disabled = true;
        this.style.color = 'var(--magenta)';
      });

      // Reset form
      form.reset();
      btn.textContent = 'Post Comment';
      btn.disabled = false;
      showToast('// TRANSMISSION RECEIVED — Comment posted');
    }, 800);
  });

  // Like buttons on existing comments
  document.querySelectorAll('.comment-like').forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.disabled) return;
      const num = parseInt(this.textContent.replace(/\D/g, ''), 10);
      this.innerHTML = `<span>♦</span> ${num + 1}`;
      this.disabled = true;
      this.style.color = 'var(--magenta)';
    });
  });
})();


/* ── CONTACT FORM ────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors('contactNameError', 'contactEmailError', 'contactSubjectError', 'contactMessageError');
    let valid = true;

    const name    = document.getElementById('contactName')?.value.trim() || '';
    const email   = document.getElementById('contactEmail')?.value.trim() || '';
    const subject = document.getElementById('contactSubject')?.value || '';
    const message = document.getElementById('contactMessage')?.value.trim() || '';

    if (!name)    { setError('contactName',    'contactNameError',    'Enter your name'); valid = false; }
    if (!email)   { setError('contactEmail',   'contactEmailError',   'Enter your email'); valid = false; }
    else if (!validateEmail(email)) { setError('contactEmail', 'contactEmailError', 'Invalid email'); valid = false; }
    if (!subj
