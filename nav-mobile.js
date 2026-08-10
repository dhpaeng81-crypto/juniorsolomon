(function () {
  'use strict';

  // ── 하위 메뉴 구조 ────────────────────────────────────────────
  var SUBMENUS = {
    '학원소개': [
      { text: '비전 & 교육철학', href: 'vision.html' },
      { text: '교육 미션',       href: 'mission.html' },
      { text: '선생님 소개',     href: 'introduction.html' },
      { text: '시설 안내',       href: 'facility.html' },
    ],
    '프로그램': [
      { text: '커리큘럼',    href: 'curriculum.html' },
      { text: '교습비 안내', href: 'fee.html' },
    ],
  };

  // 텍스트 노드만 추출 (active 표시용 <span> 제외)
  function getLabel(el) {
    return Array.from(el.childNodes)
      .filter(function (n) { return n.nodeType === 3; })
      .map(function (n) { return n.textContent.trim(); })
      .join('') || el.textContent.trim();
  }

  // 데스크탑 드롭다운 모두 닫기
  function closeAllDropdowns() {
    document.querySelectorAll('.nav-wrap.dd-open').forEach(function (w) {
      w.classList.remove('dd-open');
    });
  }

  function init() {
    var header = document.querySelector('header');
    if (!header) return;
    var inner = header.querySelector(':scope > div');
    if (!inner) return;
    var desktopNav = inner.querySelector('nav');
    if (!desktopNav) return;
    if (document.getElementById('nav-hamburger')) return;

    // DOM 수정 전에 nav 아이템 목록 수집
    var navItems = Array.from(desktopNav.children)
      .filter(function (el) { return el.tagName === 'A'; })
      .map(function (a) {
        return { label: getLabel(a), href: a.getAttribute('href'), element: a };
      });

    // ── 1. 데스크탑 드롭다운 ──────────────────────────────────
    buildDesktopDropdowns(desktopNav, navItems);

    // ── 2. 햄버거 버튼 ────────────────────────────────────────
    var btn = document.createElement('button');
    btn.id = 'nav-hamburger';
    btn.setAttribute('aria-label', '메뉴');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    inner.appendChild(btn);

    // 헤더 CTA 버튼 찾기 (마지막 직계 <a>)
    var directAs = Array.from(inner.children).filter(function (el) { return el.tagName === 'A'; });
    var ctaLink = directAs[directAs.length - 1];
    if (ctaLink) ctaLink.classList.add('header-cta');

    // ── 3. 모바일 패널 ────────────────────────────────────────
    var panel = document.createElement('div');
    panel.id = 'mobile-nav-panel';
    panel.setAttribute('role', 'navigation');
    buildMobileMenu(panel, navItems, ctaLink);
    header.insertAdjacentElement('afterend', panel);

    // 배경 오버레이
    var backdrop = document.createElement('div');
    backdrop.id = 'nav-backdrop';
    document.body.appendChild(backdrop);

    // ── 패널 열기/닫기 ────────────────────────────────────────
    function closePanel() {
      panel.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
    function openPanel() {
      panel.classList.add('open');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    btn.addEventListener('click', function () {
      panel.classList.contains('open') ? closePanel() : openPanel();
    });
    backdrop.addEventListener('click', closePanel);

    // 패널 내 링크 클릭 시 닫기 (이벤트 위임)
    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closePanel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closePanel(); closeAllDropdowns(); }
    });
  }

  // ── 데스크탑 드롭다운 구성 ───────────────────────────────────
  function buildDesktopDropdowns(nav, navItems) {
    navItems.forEach(function (item) {
      var children = SUBMENUS[item.label];
      if (!children) return;

      var a = item.element;

      // <a>를 wrapper div로 감싸기
      var wrap = document.createElement('div');
      wrap.className = 'nav-wrap';
      nav.insertBefore(wrap, a);
      wrap.appendChild(a);

      // 화살표 아이콘
      var chev = document.createElement('span');
      chev.className = 'nav-chev';
      a.appendChild(chev);

      // 드롭다운 패널
      var dd = document.createElement('div');
      dd.className = 'nav-dd';
      children.forEach(function (child) {
        var link = document.createElement('a');
        link.href = child.href;
        link.textContent = child.text;
        dd.appendChild(link);
      });
      wrap.appendChild(dd);

      // 클릭으로 토글
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var wasOpen = wrap.classList.contains('dd-open');
        closeAllDropdowns();
        if (!wasOpen) wrap.classList.add('dd-open');
      });
    });

    // 외부 클릭 시 닫기
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-wrap')) closeAllDropdowns();
    });
  }

  // ── 모바일 메뉴 구성 ─────────────────────────────────────────
  function buildMobileMenu(panel, navItems, ctaLink) {
    navItems.forEach(function (item) {
      var children = SUBMENUS[item.label];

      if (children) {
        // 아코디언 그룹
        var group = document.createElement('div');
        group.className = 'mob-group';

        var trigger = document.createElement('button');
        trigger.className = 'mob-trigger';
        var chev = document.createElement('span');
        chev.className = 'mob-chev';
        trigger.appendChild(document.createTextNode(item.label));
        trigger.appendChild(chev);

        var sub = document.createElement('div');
        sub.className = 'mob-sub';
        children.forEach(function (child) {
          var link = document.createElement('a');
          link.href = child.href;
          link.textContent = child.text;
          sub.appendChild(link);
        });

        trigger.addEventListener('click', function () {
          var isOpen = group.classList.contains('mob-open');
          panel.querySelectorAll('.mob-group.mob-open').forEach(function (g) {
            g.classList.remove('mob-open');
          });
          if (!isOpen) group.classList.add('mob-open');
        });

        group.appendChild(trigger);
        group.appendChild(sub);
        panel.appendChild(group);
      } else {
        var link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.label;
        panel.appendChild(link);
      }
    });

    // 상담 CTA 버튼
    if (ctaLink) {
      var cta = document.createElement('a');
      cta.href = ctaLink.getAttribute('href');
      cta.target = ctaLink.target || '';
      cta.rel = ctaLink.rel || '';
      cta.textContent = ctaLink.textContent.trim();
      cta.className = 'mobile-cta';
      panel.appendChild(cta);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
