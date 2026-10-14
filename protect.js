(function () {
  'use strict';

  /* ── 우클릭 차단 ── */
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  /* ── 텍스트 선택 차단 ── */
  document.addEventListener('selectstart', function (e) { e.preventDefault(); });

  /* ── 드래그 차단 ── */
  document.addEventListener('dragstart', function (e) { e.preventDefault(); });

  /* ── 키보드 단축키 차단 ── */
  document.addEventListener('keydown', function (e) {
    var ctrl = e.ctrlKey || e.metaKey;

    // Ctrl/Cmd + C, X, A, S, U, P
    if (ctrl && ['c', 'x', 'a', 's', 'u', 'p'].includes(e.key.toLowerCase())) {
      // 로그인 관련 input/textarea 는 허용
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
    }

    // F12, Ctrl+Shift+I/J/C (개발자도구)
    if (e.key === 'F12') { e.preventDefault(); return; }
    if (ctrl && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }

    // Ctrl+Shift+U (소스보기 - Firefox)
    if (ctrl && e.shiftKey && e.key.toLowerCase() === 'u') { e.preventDefault(); }
  });

  /* ── 클립보드 copy/cut 차단 ── */
  document.addEventListener('copy', function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    e.preventDefault();
  });
  document.addEventListener('cut', function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    e.preventDefault();
  });

  /* ── CSS: 텍스트 선택 비활성화 ── */
  var style = document.createElement('style');
  style.textContent = [
    'body, body * {',
    '  -webkit-user-select: none !important;',
    '  -moz-user-select: none !important;',
    '  -ms-user-select: none !important;',
    '  user-select: none !important;',
    '}',
    'input, textarea, [contenteditable] {',
    '  -webkit-user-select: text !important;',
    '  -moz-user-select: text !important;',
    '  -ms-user-select: text !important;',
    '  user-select: text !important;',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  /* ── 이미지 드래그/저장 차단 ── */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img').forEach(function (img) {
      img.setAttribute('draggable', 'false');
      img.style.pointerEvents = 'none';
    });
  });

  /* ── 개발자도구 열림 감지 (경고창) ── */
  (function devtoolsWarn() {
    var warned = false;
    var threshold = 160;
    setInterval(function () {
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        if (!warned) {
          warned = true;
          alert('이 페이지의 콘텐츠는 저작권법에 의해 보호됩니다.\n무단 복제 및 배포를 금합니다.');
        }
      } else {
        warned = false;
      }
    }, 1000);
  })();
})();
