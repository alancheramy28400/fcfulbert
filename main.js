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
});
