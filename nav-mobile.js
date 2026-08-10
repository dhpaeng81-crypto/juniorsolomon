(function () {
  'use strict';

  function init() {
    var header = document.querySelector('header');
    if (!header) return;
    var inner = header.querySelector(':scope > div');
    if (!inner) return;
    var desktopNav = inner.querySelector('nav');
    if (!desktopNav) return;
    if (document.getElementById('nav-hamburger')) return; // already initialised

    // ── Hamburger button ──────────────────────────────────────
    var btn = document.createElement('button');
    btn.id = 'nav-hamburger';
    btn.setAttribute('aria-label', '메뉴');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'mobile-nav-panel');
    btn.innerHTML = '<span></span><span></span><span></span>';
    inner.appendChild(btn);

    // Hide the header CTA button on mobile (it's duplicated inside the panel)
    var directAs = Array.from(inner.children).filter(function (el) { return el.tagName === 'A'; });
    var ctaLink = directAs[directAs.length - 1]; // last direct <a> = CTA button
    if (ctaLink) ctaLink.classList.add('header-cta');

    // ── Mobile nav panel ─────────────────────────────────────
    var panel = document.createElement('div');
    panel.id = 'mobile-nav-panel';
    panel.setAttribute('role', 'navigation');
    panel.setAttribute('aria-label', '모바일 메뉴');

    // Copy desktop nav links (text only, strip active-indicator spans)
    desktopNav.querySelectorAll('a').forEach(function (a) {
      var link = document.createElement('a');
      link.href = a.getAttribute('href');
      // Get only the first text node to avoid picking up span text
      link.textContent = Array.from(a.childNodes)
        .filter(function (n) { return n.nodeType === 3; })
        .map(function (n) { return n.textContent.trim(); })
        .join('') || a.textContent.trim();
      panel.appendChild(link);
    });

    // Duplicate CTA inside panel
    if (ctaLink) {
      var cta = document.createElement('a');
      cta.href = ctaLink.getAttribute('href');
      cta.target = ctaLink.target || '';
      cta.rel = ctaLink.rel || '';
      cta.textContent = ctaLink.textContent.trim();
      cta.className = 'mobile-cta';
      panel.appendChild(cta);
    }

    header.insertAdjacentElement('afterend', panel);

    // ── Backdrop ─────────────────────────────────────────────
    var backdrop = document.createElement('div');
    backdrop.id = 'nav-backdrop';
    document.body.appendChild(backdrop);

    // ── Toggle logic ─────────────────────────────────────────
    function closeMenu() {
      panel.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    function openMenu() {
      panel.classList.add('open');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    btn.addEventListener('click', function () {
      panel.classList.contains('open') ? closeMenu() : openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
