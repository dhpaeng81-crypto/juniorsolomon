(function () {
  'use strict';

  var SUPABASE_URL = 'https://mcdvxstcondbrwltbuvr.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jZHZ4c3Rjb25kYnJ3bHRidXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNjAyMjgsImV4cCI6MjEwMDkzNjIyOH0.45vrCiEkoGxymhsVUYZTBkekEPhFPAS5VfN722h0pwg';

  // ── CSS 삽입 ─────────────────────────────────────────────────────
  var css = `
    #header-auth { display:flex; align-items:center; gap:8px; }

    .ah-btn {
      font-size:12px; font-weight:600; cursor:pointer;
      background:none; border:none; font-family:inherit;
      padding:5px 12px; line-height:1;
      transition: background 0.15s, color 0.15s;
    }
    .ah-login {
      color: oklch(38% 0 0);
      border: 1px solid oklch(78% 0 0);
    }
    .ah-login:hover { background: oklch(93% 0 0); }
    .ah-signup {
      color: #fff;
      background: oklch(56% 0.14 50);
    }
    .ah-signup:hover { background: oklch(48% 0.14 50); }

    /* 로그인 드롭다운 */
    #ah-login-wrap { position:relative; }
    #ah-login-dd {
      display:none;
      position:absolute;
      top:calc(100% + 8px);
      right:0;
      width:280px;
      background:#fff;
      border:1px solid oklch(88% 0 0);
      box-shadow: 0 8px 24px oklch(0% 0 0 / 0.10);
      padding:20px;
      z-index:300;
    }
    #ah-login-dd.open { display:block; }
    .ah-dd-title {
      font-size:15px; font-weight:800; margin:0 0 16px;
      color:oklch(18% 0 0); letter-spacing:-0.01em;
    }
    .ah-field {
      width:100%; box-sizing:border-box;
      border:1px solid oklch(85% 0 0);
      padding:9px 12px; font-size:13.5px;
      font-family:inherit; margin-bottom:8px;
      outline:none;
    }
    .ah-field:focus { border-color:oklch(56% 0.14 50); }
    .ah-submit {
      width:100%; padding:10px; background:oklch(18% 0 0);
      color:#fff; border:none; font-size:13.5px; font-weight:700;
      font-family:inherit; cursor:pointer; margin-top:4px;
    }
    .ah-submit:hover { background:oklch(28% 0 0); }
    .ah-dd-links {
      display:flex; justify-content:space-between;
      margin-top:12px; font-size:12.5px; color:oklch(50% 0 0);
    }
    .ah-dd-links a {
      color:oklch(46% 0.14 55); text-decoration:none;
    }
    .ah-err { font-size:12px; color:oklch(48% 0.18 25); margin-bottom:6px; display:none; }

    /* 로그인 상태 */
    #ah-user-wrap { position:relative; }
    #ah-user-btn {
      display:flex; align-items:center; gap:6px;
      font-size:13px; font-weight:600; cursor:pointer;
      background:none; border:none; font-family:inherit;
      color:oklch(28% 0 0); padding:6px 10px;
    }
    #ah-user-btn:hover { background:oklch(96% 0 0); }
    #ah-user-dd {
      display:none;
      position:absolute;
      top:calc(100% + 8px);
      right:0;
      width:160px;
      background:#fff;
      border:1px solid oklch(88% 0 0);
      box-shadow: 0 8px 24px oklch(0% 0 0 / 0.10);
      z-index:300;
    }
    #ah-user-dd.open { display:block; }
    .ah-ud-item {
      display:block; padding:12px 16px;
      font-size:13.5px; font-weight:500;
      color:oklch(32% 0 0); text-decoration:none;
      border-bottom:1px solid oklch(93% 0 0);
      cursor:pointer; background:none;
      border-left:none; border-right:none; border-top:none;
      width:100%; text-align:left; font-family:inherit;
    }
    .ah-ud-item:last-child { border-bottom:none; }
    .ah-ud-item:hover { background:oklch(97% 0 0); }

    /* 모바일 패널 auth */
    .mob-auth-divider {
      border-top:1px solid oklch(88% 0 0);
      margin:16px 0 8px;
    }
    .mob-auth-login, .mob-auth-signup {
      display:block; padding:14px 0;
      font-size:17px; font-weight:700;
      text-decoration:none !important;
      border-bottom:1px solid oklch(92% 0 0);
      cursor:pointer; background:none;
      border-left:none; border-right:none; border-top:none;
      width:100%; text-align:left; font-family:inherit;
    }
    .mob-auth-login { color:oklch(18% 0 0) !important; }
    .mob-auth-signup { color:oklch(56% 0.14 50) !important; }
    .mob-auth-user {
      padding:14px 0 8px;
      font-size:14px; color:oklch(45% 0 0);
    }
    .mob-auth-logout {
      display:block; margin-top:8px;
      padding:12px 0; font-size:15px; font-weight:600;
      color:oklch(48% 0.18 25) !important;
      border-bottom:1px solid oklch(92% 0 0);
      cursor:pointer; background:none;
      border-left:none; border-right:none; border-top:none;
      width:100%; text-align:left; font-family:inherit;
    }
  `;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Supabase 로드 후 초기화 ───────────────────────────────────────
  function loadSupabase(cb) {
    if (window.supabase && window.supabase.createClient) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function init() {
    loadSupabase(function () {
      var sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      // ── 헤더 auth 영역 렌더 ───────────────────────────────────────
      function renderOut() {
        var el = document.getElementById('header-auth');
        if (!el) return;
        el.innerHTML =
          '<div id="ah-login-wrap">' +
            '<button class="ah-btn ah-login" id="ah-login-btn">로그인</button>' +
            '<div id="ah-login-dd">' +
              '<p class="ah-dd-title">로그인</p>' +
              '<div class="ah-err" id="ah-err"></div>' +
              '<input class="ah-field" id="ah-email" type="email" placeholder="이메일">' +
              '<input class="ah-field" id="ah-pw" type="password" placeholder="비밀번호" onkeydown="if(event.key===\'Enter\')window._ahLogin()">' +
              '<button class="ah-submit" onclick="window._ahLogin()">로그인</button>' +
              '<div class="ah-dd-links">' +
                '<a href="board-app.html#register">회원가입</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<a href="board-app.html#register" class="ah-btn ah-signup">회원가입</a>';

        document.getElementById('ah-login-btn').addEventListener('click', function (e) {
          e.stopPropagation();
          document.getElementById('ah-login-dd').classList.toggle('open');
        });

        window._ahLogin = async function () {
          var errEl = document.getElementById('ah-err');
          var email = document.getElementById('ah-email').value.trim();
          var pw    = document.getElementById('ah-pw').value;
          if (!email || !pw) { showErr('이메일과 비밀번호를 입력하세요'); return; }
          var btn = document.querySelector('.ah-submit');
          btn.textContent = '로그인 중…'; btn.disabled = true;
          var res = await sb.auth.signInWithPassword({ email: email, password: pw });
          btn.textContent = '로그인'; btn.disabled = false;
          if (res.error) { showErr('이메일 또는 비밀번호가 올바르지 않습니다'); return; }
          document.getElementById('ah-login-dd').classList.remove('open');
        };

        function showErr(msg) {
          var errEl = document.getElementById('ah-err');
          if (!errEl) return;
          errEl.textContent = msg; errEl.style.display = 'block';
        }

        updateMobAuth(null);
      }

      function renderIn(profile, user) {
        var el = document.getElementById('header-auth');
        if (!el) return;
        var name = (profile && profile.display_name) || user.email.split('@')[0];
        el.innerHTML =
          '<div id="ah-user-wrap">' +
            '<button id="ah-user-btn">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>' +
              name +
              '<svg width="10" height="10" viewBox="0 0 12 12" fill="oklch(55% 0 0)"><path d="M2 4l4 4 4-4"/></svg>' +
            '</button>' +
            '<div id="ah-user-dd">' +
              '<a href="board-app.html" class="ah-ud-item">커뮤니티</a>' +
              '<button class="ah-ud-item" onclick="window._ahLogout()">로그아웃</button>' +
            '</div>' +
          '</div>';

        document.getElementById('ah-user-btn').addEventListener('click', function (e) {
          e.stopPropagation();
          document.getElementById('ah-user-dd').classList.toggle('open');
        });

        window._ahLogout = async function () {
          await sb.auth.signOut();
        };

        updateMobAuth(name);
      }

      // ── 모바일 패널 auth 업데이트 ────────────────────────────────
      function updateMobAuth(displayName) {
        var panel = document.getElementById('mobile-nav-panel');
        if (!panel) return;
        // 기존 auth 요소 전부 제거 (divider 이후 형제 노드 포함)
        var divider = panel.querySelector('.mob-auth-divider');
        if (divider) {
          var toRemove = [divider];
          var cur = divider.nextSibling;
          while (cur) { toRemove.push(cur); cur = cur.nextSibling; }
          toRemove.forEach(function(el) { el.parentNode && el.parentNode.removeChild(el); });
        }

        var newDivider = document.createElement('div');
        newDivider.className = 'mob-auth-divider';
        panel.appendChild(newDivider);

        if (displayName) {
          var info = document.createElement('div');
          info.className = 'mob-auth-user';
          info.textContent = displayName + ' 님';
          panel.appendChild(info);

          var logoutBtn = document.createElement('button');
          logoutBtn.className = 'mob-auth-logout';
          logoutBtn.textContent = '로그아웃';
          logoutBtn.addEventListener('click', function () { window._ahLogout && window._ahLogout(); });
          panel.appendChild(logoutBtn);
        } else {
          var loginBtn = document.createElement('button');
          loginBtn.className = 'mob-auth-login';
          loginBtn.textContent = '로그인';
          loginBtn.addEventListener('click', function () {
            window.location.href = 'board-app.html';
          });
          panel.appendChild(loginBtn);

          var signupLink = document.createElement('a');
          signupLink.href = 'board-app.html#register';
          signupLink.className = 'mob-auth-signup';
          signupLink.textContent = '회원가입';
          panel.appendChild(signupLink);
        }
      }

      // ── 외부 클릭 시 드롭다운 닫기 ──────────────────────────────
      document.addEventListener('click', function () {
        var dd1 = document.getElementById('ah-login-dd');
        var dd2 = document.getElementById('ah-user-dd');
        if (dd1) dd1.classList.remove('open');
        if (dd2) dd2.classList.remove('open');
      });

      // ── Auth 상태 감지 ───────────────────────────────────────────
      async function boot() {
        var res = await sb.auth.getSession();
        var session = res.data && res.data.session;
        if (session && session.user) {
          var pRes = await sb.from('profiles').select('display_name').eq('id', session.user.id).single();
          renderIn(pRes.data, session.user);
        } else {
          renderOut();
        }

        sb.auth.onAuthStateChange(async function (event, session) {
          if (session && session.user) {
            var pRes = await sb.from('profiles').select('display_name').eq('id', session.user.id).single();
            renderIn(pRes.data, session.user);
          } else {
            renderOut();
          }
        });
      }

      boot();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
