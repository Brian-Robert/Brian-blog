'use strict';

/* ── NAVBAR ──────────────────────── */
(function () {
  const nav     = document.getElementById('nav');
  const burger  = document.getElementById('burger');
  const links   = document.getElementById('navLinks');
  const btt     = document.getElementById('btt');
  const secs    = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 20);
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);

    // Active link
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    document.querySelectorAll('.nav-link').forEach(l =>
      l.classList.toggle('active', l.dataset.s === cur)
    );
  }, { passive: true });

  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = !links.classList.contains('open');
      links.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('.nav-link').forEach(l =>
      l.addEventListener('click', () => {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      })
    );
  }

  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* ── TICKER DUPLICATE ────────────── */
(function () {
  const t = document.getElementById('ticker');
  if (t) t.innerHTML += t.innerHTML;
})();


/* ── SCROLL REVEAL ───────────────── */
(function () {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
  els.forEach(el => obs.observe(el));
})();


/* ── FILTER TABS ─────────────────── */
(function () {
  const tabs  = document.querySelectorAll('.ftab');
  const cards = document.querySelectorAll('.post-card[data-cat], .post-featured[data-cat]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const f = tab.dataset.f;
      cards.forEach(c => {
        const show = f === 'all' || c.dataset.cat === f;
        c.classList.toggle('hidden', !show);
      });
    });
  });
})();


/* ── LOAD MORE ───────────────────── */
(function () {
  const btn = document.getElementById('loadMore');
  if (!btn) return;
  let done = false;

  btn.addEventListener('click', () => {
    if (done) return;
    done = true;
    btn.textContent = 'Loading...';
    btn.disabled = true;

    setTimeout(() => {
      const grid = document.getElementById('postsGrid');
      const more = [
        { cat: 'security', tag: 'security', label: 'Security', title: 'Social Engineering in 2026',  excerpt: 'The most sophisticated attacks still exploit the most ancient vulnerability: human trust.',                    by: 'NEON_WOLF',     date: 'Jul 17' },
        { cat: 'ai',       tag: 'ai',       label: 'AI',       title: 'Emergent Behavior at Scale',  excerpt: 'Capabilities in large models that nobody programmed — and nobody fully understands yet.',                   by: 'CIRCUIT_SAGE',  date: 'Jul 14' },
        { cat: 'tech',     tag: 'tech',     label: 'Tech',     title: 'What 6G Actually Means',       excerpt: 'Moving beyond the marketing language: the genuine infrastructure shift that is coming, and when.',           by: 'SYS_NULL',      date: 'Jul 10' },
      ];

      more.forEach(p => {
        const a = document.createElement('a');
        a.href = 'post.html';
        a.className = 'post-card reveal';
        a.dataset.cat = p.cat;
        a.innerHTML = `
          <span class="tag tag-${p.tag}">${p.label}</span>
          <h3 class="pc-title">${p.title}</h3>
          <p class="pc-excerpt">${p.excerpt}</p>
          <div class="pc-meta"><span>${p.by}</span><span>${p.date}</span></div>
        `;
        grid.appendChild(a);
        requestAnimationFrame(() => requestAnimationFrame(() => a.classList.add('visible')));
      });

      btn.textContent = 'All caught up';
      btn.style.opacity = '0.45';
    }, 700);
  });
})();


/* ── FAQ ─────────────────────────── */
(function () {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        item.querySelector('.faq-q')?.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* ── VALIDATION HELPERS ──────────── */
function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function setErr(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (input) input.style.borderColor = msg ? '#e53e3e' : '';
  if (err)   err.textContent = msg || '';
}

function clearErr(...ids) { ids.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ''; }); }

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}


/* ── TOAST ───────────────────────── */
let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3200);
}


/* ── MODALS ──────────────────────── */
(function () {
  const liModal = document.getElementById('loginModal');
  const suModal = document.getElementById('signupModal');
  if (!liModal || !suModal) return;

  function openModal(m) {
    m.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('visible')));
    document.body.style.overflow = 'hidden';
    setTimeout(() => m.querySelector('input')?.focus(), 200);
  }

  function closeModal(m) {
    m.classList.remove('visible');
    setTimeout(() => { m.hidden = true; }, 260);
    document.body.style.overflow = '';
  }

  function closeAll() { closeModal(liModal); closeModal(suModal); }

  // Triggers
  document.getElementById('loginBtn')?.addEventListener('click', () => openModal(liModal));
  document.getElementById('signupBtn')?.addEventListener('click', () => openModal(suModal));
  document.getElementById('heroSignup')?.addEventListener('click', () => openModal(suModal));

  // Overlay click
  [liModal, suModal].forEach(m => m.addEventListener('click', e => { if (e.target === m) closeAll(); }));

  // Close buttons
  document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', closeAll));

  // Switch
  document.getElementById('toSignup')?.addEventListener('click', () => { closeModal(liModal); setTimeout(() => openModal(suModal), 220); });
  document.getElementById('toLogin')?.addEventListener('click',  () => { closeModal(suModal); setTimeout(() => openModal(liModal), 220); });

  // Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  /* Login form */
  document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    clearErr('liEmailErr', 'liPassErr');
    let ok = true;
    const email = document.getElementById('liEmail')?.value.trim() || '';
    const pass  = document.getElementById('liPass')?.value || '';

    if (!email)         { setErr('liEmail', 'liEmailErr', 'Enter your email'); ok = false; }
    else if (!isEmail(email)) { setErr('liEmail', 'liEmailErr', 'Enter a valid email'); ok = false; }
    if (!pass)          { setErr('liPass',  'liPassErr',  'Enter your password'); ok = false; }
    if (!ok) return;

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Logging in...'; btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Log in'; btn.disabled = false;
      const s = document.getElementById('liSuccess');
      if (s) s.textContent = '✓ Logged in successfully';
      toast('Welcome back!');
      setTimeout(closeAll, 1400);
    }, 1000);
  });

  /* Signup form */
  const suPass = document.getElementById('suPass');
  const fill   = document.getElementById('strengthFill');
  const label  = document.getElementById('strengthLabel');

  suPass?.addEventListener('input', () => {
    const v = suPass.value;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    const map = [
      { w: '0%',   c: '#e53e3e', l: '' },
      { w: '25%',  c: '#e53e3e', l: 'Weak' },
      { w: '50%',  c: '#d69e2e', l: 'Fair' },
      { w: '75%',  c: '#3182ce', l: 'Good' },
      { w: '100%', c: '#38a169', l: 'Strong' },
    ];

    if (fill)  { fill.style.width = v.length ? map[score].w : '0%'; fill.style.background = map[score].c; }
    if (label) { label.textContent = v.length ? map[score].l : ''; label.style.color = map[score].c; }
  });

  document.getElementById('signupForm')?.addEventListener('submit', e => {
    e.preventDefault();
    clearErr('suNameErr', 'suEmailErr', 'suPassErr');
    let ok = true;
    const name  = document.getElementById('suName')?.value.trim() || '';
    const email = document.getElementById('suEmail')?.value.trim() || '';
    const pass  = document.getElementById('suPass')?.value || '';

    if (!name)          { setErr('suName',  'suNameErr',  'Enter your name'); ok = false; }
    if (!email)         { setErr('suEmail', 'suEmailErr', 'Enter your email'); ok = false; }
    else if (!isEmail(email)) { setErr('suEmail', 'suEmailErr', 'Enter a valid email'); ok = false; }
    if (!pass)          { setErr('suPass',  'suPassErr',  'Create a password'); ok = false; }
    else if (pass.length < 8) { setErr('suPass', 'suPassErr', 'At least 8 characters'); ok = false; }
    if (!ok) return;

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Creating account...'; btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Create account'; btn.disabled = false;
      const s = document.getElementById('suSuccess');
      if (s) s.textContent = '✓ Account created — check your email';
      toast('Account created! Check your inbox.');
      setTimeout(closeAll, 2000);
    }, 1100);
  });
})();


/* ── COMMENT FORM ────────────────── */
(function () {
  const form = document.getElementById('commentForm');
  if (!form) return;

  // Like buttons
  document.querySelectorAll('.c-like').forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.disabled) return;
      const n = parseInt(this.textContent.replace(/\D/g,''), 10);
      this.innerHTML = `<span>♥</span> ${n + 1}`;
      this.disabled = true;
      this.classList.add('liked');
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErr('cNameErr', 'cEmailErr', 'cTextErr');
    let ok = true;
    const name  = document.getElementById('cName')?.value.trim() || '';
    const email = document.getElementById('cEmail')?.value.trim() || '';
    const text  = document.getElementById('cText')?.value.trim() || '';

    if (!name)          { setErr('cName',  'cNameErr',  'Enter your name'); ok = false; }
    if (!email)         { setErr('cEmail', 'cEmailErr', 'Enter your email'); ok = false; }
    else if (!isEmail(email)) { setErr('cEmail', 'cEmailErr', 'Enter a valid email'); ok = false; }
    if (!text)          { setErr('cText',  'cTextErr',  'Write your comment'); ok = false; }
    else if (text.length < 8) { setErr('cText', 'cTextErr', 'A bit short — say more'); ok = false; }
    if (!ok) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Posting...'; btn.disabled = true;

    setTimeout(() => {
      const list    = document.getElementById('commentsList');
      const countEl = document.getElementById('ccount');
      const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

      const el = document.createElement('div');
      el.className = 'comment reveal';
      el.innerHTML = `
        <div class="c-avatar">${initials}</div>
        <div class="c-body">
          <div class="c-head">
            <strong>${escHtml(name)}</strong>
            <span>Just now</span>
          </div>
          <p>${escHtml(text)}</p>
          <button class="c-like" aria-label="Like"><span>♥</span> 0</button>
        </div>
      `;
      list.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));

      el.querySelector('.c-like')?.addEventListener('click', function () {
        if (this.disabled) return;
        const n = parseInt(this.textContent.replace(/\D/g,''), 10);
        this.innerHTML = `<span>♥</span> ${n + 1}`;
        this.disabled = true;
        this.classList.add('liked');
      });

      if (countEl) {
        const cur = parseInt(countEl.textContent.replace(/\D/g,''), 10);
        countEl.textContent = `(${cur + 1})`;
      }

      form.reset();
      btn.textContent = 'Post comment'; btn.disabled = false;
      toast('Comment posted!');
    }, 700);
  });
})();


/* ── CONTACT FORM ────────────────── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErr('cfNameErr', 'cfEmailErr', 'cfSubjectErr', 'cfMsgErr');
    let ok = true;

    const name    = document.getElementById('cfName')?.value.trim() || '';
    const email   = document.getElementById('cfEmail')?.value.trim() || '';
    const subject = document.getElementById('cfSubject')?.value || '';
    const msg     = document.getElementById('cfMsg')?.value.trim() || '';

    if (!name)    { setErr('cfName',    'cfNameErr',    'Enter your name'); ok = false; }
    if (!email)   { setErr('cfEmail',   'cfEmailErr',   'Enter your email'); ok = false; }
    else if (!isEmail(email)) { setErr('cfEmail', 'cfEmailErr', 'Enter a valid email'); ok = false; }
    if (!subject) { setErr('cfSubject', 'cfSubjectErr', 'Choose a topic'); ok = false; }
    if (!msg)     { setErr('cfMsg',     'cfMsgErr',     'Write your message'); ok = false; }
    else if (msg.length < 15) { setErr('cfMsg', 'cfMsgErr', 'A bit brief — add more detail'); ok = false; }
    if (!ok) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...'; btn.disabled = true;

    setTimeout(() => {
      const s = document.getElementById('cfSuccess');
      if (s) s.textContent = '✓ Message sent. We\'ll reply within 48 hours.';
      btn.textContent = 'Send message'; btn.disabled = false;
      form.reset();
      toast('Message sent!');
    }, 900);
  });
})();


/* ── NEWSLETTER ──────────────────── */
(function () {
  const form = document.getElementById('nlForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('nlEmail')?.value.trim() || '';
    const errEl = document.getElementById('nlErr');
    const sucEl = document.getElementById('nlSuccess');
    if (errEl) errEl.textContent = '';
    if (sucEl) sucEl.textContent = '';

    if (!email)          { if (errEl) errEl.textContent = 'Enter your email'; return; }
    if (!isEmail(email)) { if (errEl) errEl.textContent = 'Enter a valid email'; return; }

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Subscribing...'; btn.disabled = true;

    setTimeout(() => {
      if (sucEl) sucEl.textContent = '✓ Subscribed — check your inbox';
      btn.textContent = 'Subscribe'; btn.disabled = false;
      form.reset();
      toast('Subscribed! Welcome to SIGNAL.');
    }, 800);
  });
})();
