document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      }
    });
  });

  // Update year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Ensure canonical is set to the current page when not provided
  try {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && !canonical.getAttribute('href')) {
      canonical.setAttribute('href', window.location.href);
    }
  } catch (e) {
    // ignore in non-browser environments
  }

  // Make skip link visible when focused (CSS fallback may hide it)
  const skip = document.querySelector('.sr-only');
  if (skip) {
    skip.addEventListener('focus', function () {
      this.style.position = 'static';
      this.style.width = 'auto';
      this.style.height = 'auto';
      this.style.margin = '0 0 16px 0';
      this.style.clip = 'auto';
    });
    skip.addEventListener('blur', function () {
      // restore visually-hidden
      this.style.position = '';
      this.style.width = '';
      this.style.height = '';
      this.style.margin = '';
      this.style.clip = '';
    });
  }

  // Simple active nav link on scroll
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  function onScroll() {
    let fromTop = window.scrollY + 120;
    sections.forEach(section => {
      if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
        navLinks.forEach(link => link.classList.remove('active'));
        const id = section.getAttribute('id');
        const active = document.querySelector('.main-nav a[href="#' + id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-navigation');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        mainNav.style.display = 'none';
        this.setAttribute('aria-label', 'Ouvrir le menu');
      } else {
        mainNav.style.display = 'block';
        this.setAttribute('aria-label', 'Fermer le menu');
      }
    });
    // close mobile nav when a link is clicked
    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (window.innerWidth < 820) {
        mainNav.style.display = 'none';
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Ouvrir le menu');
      }
    }));
  }

  // Simple form handling (simulated submit)
  const form = document.getElementById('signup');
  const result = document.getElementById('form-result');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // basic validation with inline messages
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      // clear previous errors
      form.querySelectorAll('.error').forEach(n => n.remove());
      let hasError = false;
      if (!name.value.trim()) {
        const err = document.createElement('div'); err.className = 'error'; err.textContent = 'Veuillez saisir votre nom.'; name.parentNode.appendChild(err); hasError = true;
      }
      if (!email.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        const err = document.createElement('div'); err.className = 'error'; err.textContent = 'Veuillez saisir une adresse email valide.'; email.parentNode.appendChild(err); hasError = true;
      }
      if (hasError) { if (result) result.textContent = 'Veuillez corriger les erreurs ci-dessus.'; return; }

      // simulate send
      if (result) result.textContent = 'Envoi en cours...';
      setTimeout(() => {
        if (result) result.textContent = 'Merci, votre inscription a bien été prise en compte.';
        form.reset();
        try { if (window.gtag) gtag('event', 'signup_submit', { method: 'site_form' }); } catch(e){}
      }, 800);
    });
  }

  // --- Dynamic content: load events and teams from /data ---
  async function fetchJSON(path) {
    try {
      const res = await fetch(path, {cache: 'no-store'});
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      return await res.json();
    } catch (err) {
      console.error('Fetch error', path, err);
      throw err;
    }
  }

  function formatDate(iso) {
    try {
      const d = new Date(iso + 'T00:00:00');
      return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return iso;
    }
  }

  async function renderNews() {
    const container = document.getElementById('news-list');
    if (!container) return;
    try {
      const data = await fetchJSON('data/events.json');
      const events = (data && data.events) ? data.events.slice() : [];
      // sort by date desc
      events.sort((a,b) => new Date(b.date) - new Date(a.date));
      container.innerHTML = '';
      if (events.length === 0) {
        container.innerHTML = '<p class="muted">Aucune actualité pour le moment.</p>';
        return;
      }
      events.forEach(ev => {
        const art = document.createElement('article');
        art.className = 'news';
        art.innerHTML = `
          <h3>${ev.title}</h3>
          <time datetime="${ev.date}">${formatDate(ev.date)}</time>
          <p>${ev.summary}</p>
          ${ev.cta ? `<p><a href="${ev.cta_link || '#'}" class="btn-small">${ev.cta}</a></p>` : ''}
        `;
        container.appendChild(art);
      });
      // inject JSON-LD for events for SEO
      try { injectEventsJsonLd(events); } catch (e) { console.warn('JSON-LD injection failed', e); }
    } catch (e) {
      container.innerHTML = '<p class="muted">Impossible de charger les actualités pour le moment.</p>';
    }
  }

  async function renderTeams() {
    const container = document.getElementById('teams-list');
    if (!container) return;
    try {
      const data = await fetchJSON('data/teams.json');
      const teams = (data && data.teams) ? data.teams : [];
      container.innerHTML = '';
      if (teams.length === 0) {
        container.innerHTML = '<p class="muted">Aucune information sur les équipes pour le moment.</p>';
        return;
      }
      teams.forEach(t => {
        const art = document.createElement('article');
        art.innerHTML = `
          <h3>${t.name}</h3>
          <p><strong>Entraîneur:</strong> ${t.coach}</p>
          <p><strong>Entraînements:</strong> ${t.training}</p>
          <p><a href="mailto:${t.email}">${t.email}</a></p>
        `;
        container.appendChild(art);
      });
    } catch (e) {
      container.innerHTML = '<p class="muted">Impossible de récupérer les équipes.</p>';
    }
  }

  // Run dynamic renderers
  renderNews();
  renderTeams();

  // Share button (Web Share API + fallback clipboard)
  const shareBtn = document.getElementById('share-btn');
  const shareResult = document.getElementById('share-result');
  if (shareBtn) {
    shareBtn.addEventListener('click', async function () {
      const shareData = {
        title: document.title,
        text: 'Découvrez le FC Fulbert — club de football à Chartres :',
        url: window.location.href
      };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          if (shareResult) shareResult.textContent = 'Merci d\'avoir partagé !';
          try { if (window.gtag) gtag('event', 'share', { method: 'web_share' }); } catch(e){}
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareData.url);
          if (shareResult) shareResult.textContent = 'Lien copié dans le presse-papiers. Partagez-le où vous le souhaitez.';
          try { if (window.gtag) gtag('event', 'share', { method: 'copy_clipboard' }); } catch(e){}
        } else {
          // fallback: select a temporary input
          const tmp = document.createElement('input');
          tmp.value = shareData.url;
          document.body.appendChild(tmp);
          tmp.select();
          try { document.execCommand('copy'); if (shareResult) shareResult.textContent = 'Lien copié.'; } catch (e) { if (shareResult) shareResult.textContent = 'Impossible de copier. Veuillez copier manuellement l\'URL.'; }
          tmp.remove();
          try { if (window.gtag) gtag('event', 'share', { method: 'copy_execCommand' }); } catch(e){}
        }
      } catch (err) {
        console.warn('Share failed', err);
        if (shareResult) shareResult.textContent = 'Le partage a été annulé ou a échoué.';
      }
      // clear message after a few seconds
      if (shareResult) setTimeout(() => { shareResult.textContent = ''; }, 6000);
    });
  }

  // Track CTA clicks (hero CTAs and floating CTA)
  document.querySelectorAll('.hero-ctas a, .floating-cta a').forEach(a => {
    a.addEventListener('click', function () {
      const label = this.textContent.trim().slice(0,50);
      try { if (window.gtag) gtag('event', 'cta_click', { label: label, href: this.getAttribute('href') }); } catch(e){}
    });
  });

  // Inject structured data for events
  function injectEventsJsonLd(events) {
    if (!Array.isArray(events) || events.length === 0) return;
    const schema = events.map(ev => ({
      "@type": "Event",
      "name": ev.title,
      "startDate": ev.date,
      "location": {
        "@type": "Place",
        "name": ev.location || 'Stade Fulbert',
        "address": ev.location || 'Stade Fulbert, Chartres'
      },
      "image": ev.image ? new URL(ev.image, window.location.href).href : undefined,
      "description": ev.description || ev.summary,
      "organizer": {
        "@type": "SportsOrganization",
        "name": "FC Fulbert",
        "url": window.location.origin + window.location.pathname
      }
    }));

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": schema
    }, null, 2);
    document.head.appendChild(script);
  }
});
