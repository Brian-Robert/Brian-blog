'use strict';

/* ── UTILS ───────────────────────── */
function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

function setErr(inputId, errId, msg) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (inp) inp.style.borderColor = msg ? '#e53e3e' : '';
  if (err) err.textContent = msg || '';
}

function clearErrs(...errIds) {
  errIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  // also clear red borders for inputs paired with these errors
  errIds.forEach(id => {
    const inp = document.getElementById(id.replace('Err',''));
    if (inp) inp.style.borderColor = '';
  });
}

function escHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3200);
}

/* ── NAVBAR + SCROLL SPY ─────────── */
(function () {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const links  = document.getElementById('navLinks');
  const btt    = document.getElementById('btt');

  // Only real sections for scroll spy
  const spySections = ['home','posts','comments','faq','support','contact'];

  window.addEventListener('scroll', () => {
    if (!nav) return;
    const sy = window.scrollY;

    nav.classList.toggle('scrolled', sy > 20);
    if (btt) btt.classList.toggle('visible', sy > 400);

    // Active nav link
    let current = 'home';
    spySections.forEach(id => {
      const sec = document.getElementById(id);
      if (sec && sy >= sec.offsetTop - 130) current = id;
    });
    document.querySelectorAll('.nav-link[data-s]').forEach(l =>
      l.classList.toggle('active', l.dataset.s === current)
    );
  }, { passive: true });

  // Hamburger
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

/* ── TICKER ──────────────────────── */
(function () {
  const t = document.getElementById('ticker');
  if (!t) return;
  // Duplicate for seamless loop
  t.innerHTML += t.innerHTML;
})();

/* ── SCROLL REVEAL ───────────────── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── FILTER TABS ─────────────────── */
(function () {
  const tabs  = document.querySelectorAll('.ftab');
  const cards = document.querySelectorAll('.post-card, .post-featured');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update tab state
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');

      const f = tab.dataset.f;
      cards.forEach(card => {
        const match = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('hidden', !match);
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
      if (!grid) return;

      const more = [
        { cat:'security', tag:'security', label:'Security', title:'Social Engineering in 2026',  excerpt:'The most sophisticated attacks still exploit the most ancient vulnerability: human trust.',          by:'NEON_WOLF',    date:'Jul 17' },
        { cat:'ai',       tag:'ai',       label:'AI',       title:'Emergent Behavior at Scale',  excerpt:'Capabilities appearing in large models that nobody programmed — and nobody fully understands.',  by:'CIRCUIT_SAGE', date:'Jul 14' },
        { cat:'tech',     tag:'tech',     label:'Tech',     title:'What 6G Actually Means',      excerpt:'Beyond the marketing language: the real infrastructure shift that is coming, and when.',          by:'SYS_NULL',     date:'Jul 10' },
      ];

      // Check current active filter
      const activeTab = document.querySelector('.ftab.active');
      const currentFilter = activeTab ? activeTab.dataset.f : 'all';

      more.forEach(p => {
        const a = document.createElement('a');
        a.href = 'post.html';
        a.className = 'post-card reveal';
        a.dataset.cat = p.cat;
        // Hide immediately if filter doesn't match
        if (currentFilter !== 'all' && currentFilter !== p.cat) a.classList.add('hidden');
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
      btn.style.opacity = '0.4';
    }, 700);
  });
})();

/* ── FAQ ─────────────────────────── */
(function () {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q')?.setAttribute('aria-expanded','false');
      });
      // Open clicked one (if it was closed)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      }
    });
  });
})();

/* ── MODALS ──────────────────────── */
(function () {
  const liModal = document.getElementById('loginModal');
  const suModal = document.getElementById('signupModal');
  if (!liModal || !suModal) return;

  function openModal(m) {
    m.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('visible')));
    document.body.style.overflow = 'hidden';
    setTimeout(() => m.querySelector('input')?.focus(), 250);
  }

  function closeModal(m) {
    m.classList.remove('visible');
    setTimeout(() => { m.hidden = true; }, 280);
    document.body.style.overflow = '';
  }

  function closeAll() { closeModal(liModal); closeModal(suModal); }

  // Open triggers
  document.getElementById('loginBtn')?.addEventListener('click', () => openModal(liModal));
  document.getElementById('signupBtn')?.addEventListener('click', () => openModal(suModal));
  document.getElementById('heroSignup')?.addEventListener('click', () => openModal(suModal));

  // Close on overlay click
  [liModal, suModal].forEach(m =>
    m.addEventListener('click', e => { if (e.target === m) closeAll(); })
  );

  // Close buttons
  document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', closeAll));

  // Switch between modals
  document.getElementById('toSignup')?.addEventListener('click', () => {
    closeModal(liModal);
    setTimeout(() => openModal(suModal), 260);
  });
  document.getElementById('toLogin')?.addEventListener('click', () => {
    closeModal(suModal);
    setTimeout(() => openModal(liModal), 260);
  });

  // Forgot password — show simple inline message
  document.getElementById('toForgot')?.addEventListener('click', () => {
    const s = document.getElementById('liSuccess');
    if (s) {
      s.textContent = '✉ Enter your email above and we\'ll send a reset link.';
      s.style.color = 'var(--accent)';
    }
  });

  // Escape key
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  /* LOGIN */
  document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    clearErrs('liEmailErr','liPassErr');
    let ok = true;

    const email = document.getElementById('liEmail')?.value.trim() || '';
    const pass  = document.getElementById('liPass')?.value || '';

    if (!email)           { setErr('liEmail','liEmailErr','Enter your email'); ok = false; }
    else if (!isEmail(email)) { setErr('liEmail','liEmailErr','Enter a valid email'); ok = false; }
    if (!pass)            { setErr('liPass','liPassErr','Enter your password'); ok = false; }
    if (!ok) return;

    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Logging in...'; btn.disabled = true;

    setTimeout(() => {
      btn.textContent = orig; btn.disabled = false;
      const s = document.getElementById('liSuccess');
      if (s) { s.textContent = '✓ Logged in successfully'; s.style.color = ''; }
      toast('Welcome back!');
      setTimeout(closeAll, 1400);
    }, 1000);
  });

  /* SIGN UP — password strength */
  const suPassEl    = document.getElementById('suPass');
  const strengthFill  = document.getElementById('strengthFill');
  const strengthLabel = document.getElementById('strengthLabel');

  if (suPassEl) {
    suPassEl.addEventListener('input', () => {
      const v = suPassEl.value;
      let score = 0;
      if (v.length >= 8)          score++;
      if (/[A-Z]/.test(v))        score++;
      if (/[0-9]/.test(v))        score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;

      const levels = [
        { w:'0%',   c:'#e53e3e', l:'' },
        { w:'25%',  c:'#e53e3e', l:'Weak' },
        { w:'50%',  c:'#d69e2e', l:'Fair' },
        { w:'75%',  c:'#3182ce', l:'Good' },
        { w:'100%', c:'#38a169', l:'Strong' },
      ];
      const lvl = levels[v.length ? score : 0];
      if (strengthFill)  { strengthFill.style.width = lvl.w; strengthFill.style.background = lvl.c; }
      if (strengthLabel) { strengthLabel.textContent = lvl.l; strengthLabel.style.color = lvl.c; }
    });
  }

  document.getElementById('signupForm')?.addEventListener('submit', e => {
    e.preventDefault();
    clearErrs('suNameErr','suEmailErr','suPassErr');
    let ok = true;

    const name  = document.getElementById('suName')?.value.trim() || '';
    const email = document.getElementById('suEmail')?.value.trim() || '';
    const pass  = document.getElementById('suPass')?.value || '';

    if (!name)            { setErr('suName','suNameErr','Enter your name'); ok = false; }
    if (!email)           { setErr('suEmail','suEmailErr','Enter your email'); ok = false; }
    else if (!isEmail(email)) { setErr('suEmail','suEmailErr','Enter a valid email'); ok = false; }
    if (!pass)            { setErr('suPass','suPassErr','Create a password'); ok = false; }
    else if (pass.length < 8) { setErr('suPass','suPassErr','At least 8 characters'); ok = false; }
    if (!ok) return;

    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Creating account...'; btn.disabled = true;

    setTimeout(() => {
      btn.textContent = orig; btn.disabled = false;
      const s = document.getElementById('suSuccess');
      if (s) s.textContent = '✓ Account created — check your email';
      toast('Account created! Check your inbox.');
      setTimeout(closeAll, 2000);
    }, 1100);
  });
})();

/* ── COMMENT LIKE BUTTONS ────────── */
function attachLike(btn) {
  btn.addEventListener('click', function handler() {
    this.removeEventListener('click', handler);
    const n = parseInt(this.textContent.replace(/\D/g,''), 10) || 0;
    this.innerHTML = `<span>♥</span> ${n + 1}`;
    this.classList.add('liked');
  });
}
document.querySelectorAll('.c-like').forEach(attachLike);

/* ── COMMENT FORM ────────────────── */
(function () {
  const form = document.getElementById('commentForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrs('cNameErr','cEmailErr','cTextErr');
    let ok = true;

    const name  = document.getElementById('cName')?.value.trim() || '';
    const email = document.getElementById('cEmail')?.value.trim() || '';
    const text  = document.getElementById('cText')?.value.trim() || '';

    if (!name)            { setErr('cName','cNameErr','Enter your name'); ok = false; }
    if (!email)           { setErr('cEmail','cEmailErr','Enter your email'); ok = false; }
    else if (!isEmail(email)) { setErr('cEmail','cEmailErr','Enter a valid email'); ok = false; }
    if (!text)            { setErr('cText','cTextErr','Write your comment'); ok = false; }
    else if (text.length < 8) { setErr('cText','cTextErr','A bit short — say more'); ok = false; }
    if (!ok) return;

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Posting...'; btn.disabled = true;

    setTimeout(() => {
      // Build initials
      const initials = name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() || '').join('').slice(0,2) || '??';

      const el = document.createElement('div');
      el.className = 'comment reveal';
      el.innerHTML = `
        <div class="c-avatar">${escHtml(initials)}</div>
        <div class="c-body">
          <div class="c-head">
            <strong>${escHtml(name)}</strong>
            <span>Just now</span>
          </div>
          <p>${escHtml(text)}</p>
          <button class="c-like" aria-label="Like comment"><span>♥</span> 0</button>
        </div>
      `;

      const list = document.getElementById('commentsList');
      if (list) {
        list.appendChild(el);
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
        const likeBtn = el.querySelector('.c-like');
        if (likeBtn) attachLike(likeBtn);
      }

      // Update count
      const countEl = document.getElementById('ccount');
      if (countEl) {
        const cur = parseInt(countEl.textContent.replace(/\D/g,''), 10) || 0;
        countEl.textContent = `(${cur + 1})`;
      }

      form.reset();
      clearErrs('cNameErr','cEmailErr','cTextErr');
      btn.textContent = orig; btn.disabled = false;
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
    clearErrs('cfNameErr','cfEmailErr','cfSubjectErr','cfMsgErr');
    let ok = true;

    const name    = document.getElementById('cfName')?.value.trim() || '';
    const email   = document.getElementById('cfEmail')?.value.trim() || '';
    const subject = document.getElementById('cfSubject')?.value || '';
    const msg     = document.getElementById('cfMsg')?.value.trim() || '';

    if (!name)            { setErr('cfName','cfNameErr','Enter your name'); ok = false; }
    if (!email)           { setErr('cfEmail','cfEmailErr','Enter your email'); ok = false; }
    else if (!isEmail(email)) { setErr('cfEmail','cfEmailErr','Enter a valid email'); ok = false; }
    if (!subject)         { setErr('cfSubject','cfSubjectErr','Choose a topic'); ok = false; }
    if (!msg)             { setErr('cfMsg','cfMsgErr','Write your message'); ok = false; }
    else if (msg.length < 15) { setErr('cfMsg','cfMsgErr','A bit brief — add more detail'); ok = false; }
    if (!ok) return;

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending...'; btn.disabled = true;

    setTimeout(() => {
      btn.textContent = orig; btn.disabled = false;
      const s = document.getElementById('cfSuccess');
      if (s) s.textContent = "✓ Message sent — we'll reply within 48 hours.";
      form.reset();
      clearErrs('cfNameErr','cfEmailErr','cfSubjectErr','cfMsgErr');
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
    const emailEl = document.getElementById('nlEmail');
    const errEl   = document.getElementById('nlErr');
    const sucEl   = document.getElementById('nlSuccess');
    const email   = emailEl?.value.trim() || '';

    if (errEl) errEl.textContent = '';
    if (sucEl) sucEl.textContent = '';

    if (!email)           { if (errEl) errEl.textContent = 'Enter your email'; return; }
    if (!isEmail(email))  { if (errEl) errEl.textContent = 'Enter a valid email'; return; }

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Subscribing...'; btn.disabled = true;

    setTimeout(() => {
      btn.textContent = orig; btn.disabled = false;
      if (sucEl) sucEl.textContent = '✓ Subscribed — check your inbox!';
      form.reset();
      toast('Subscribed! Welcome to SIGNAL.');
    }, 800);
  });
})();
