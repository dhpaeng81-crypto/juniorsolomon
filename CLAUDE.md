# 주니어솔로몬 홈페이지 — 프로젝트 가이드

> 이 파일은 Claude Code가 저장소를 열 때 자동으로 읽습니다. 수정 전에 끝까지 읽고, 구조가 바뀌면 이 문서도 함께 고쳐 주세요.

## 1. 한눈에 보기

- **무엇**: 서울 용산구 이촌동 독서철학논술 학원 "주니어솔로몬"의 홈페이지 + 커뮤니티 게시판.
- **주소**: https://juniorsolomon.com (www.juniorsolomon.com 도 사용)
- **방식**: 빌드 없는 **정적 HTML 사이트**. 프레임워크, 패키지 설치, 번들러 없음. 파일을 고치면 그대로 반영됩니다.
- **호스팅**: Vercel (프로젝트 `juniorsolomon`, 팀 `dhpaeng81-3292s-projects`). `master` 브랜치에 푸시하면 자동 배포(GitHub 연동 + `.github/workflows/deploy.yml`).
- **도메인**: 가비아에서 구매, DNS는 Vercel을 가리킴.
- **게시판 백엔드**: Supabase (인증, DB, 파일 저장). 홈페이지 본문 페이지들은 백엔드가 없습니다.
- **사용자**: 학부모(스마트폰 위주, 고령 포함), 수강생, 강사, 관리자. 언어는 한국어.

## 2. 작업 규칙 (꼭 지켜주세요)

1. **`master`에 바로 푸시하면 곧바로 실제 사이트에 배포됩니다.** 작업 브랜치에서 고치고 Pull Request로 올려 대표님 승인을 받은 뒤 병합하세요.
2. 비밀번호, 개인 토큰, 서비스 롤 키는 **절대 커밋하지 않습니다.** (Supabase `anon` 키는 공개용으로 코드에 들어 있는 것이 정상입니다. 데이터 보호는 Supabase의 RLS 정책이 담당합니다.)
3. 이 저장소는 **공개(public)** 입니다. 학생·학부모 개인정보, 상담 내용은 코드나 이슈에 넣지 마세요.
4. **모바일 먼저**: 학부모는 대부분 휴대폰으로 봅니다. 수정 후 폭 400px 정도에서 꼭 확인하세요.
5. 본문 글자는 **최소 14px**, 터치 영역은 **최소 44px**, 본문 대비 4.5:1 이상(WCAG AA).
6. 문구 톤은 따뜻하고 신뢰감 있게. 과장된 광고 문구, 과한 그라데이션·글래스 효과·번쩍이는 애니메이션은 쓰지 않습니다. (`PRODUCT.md` 참고)
7. 한국어 줄바꿈이 어색하지 않도록 `word-break: keep-all`을 기본으로 유지합니다.
8. 파일 수정 전에는 **해당 파일을 먼저 읽고** 기존 스타일(대부분 인라인 스타일 + OKLCH 색상)에 맞춰 고칩니다. 대규모 리팩터링이나 프레임워크 도입은 하지 않습니다.

## 3. 로컬에서 확인하기

```bash
python3 -m http.server 8000   # 저장소 루트에서
# http://localhost:8000/index.html
```

- 본문 페이지는 이것만으로 확인됩니다.
- 게시판(`board-app.html`)은 인터넷으로 Supabase에 접속해야 동작합니다. 카카오 로그인은 실제 도메인에서만 완전히 동작합니다.

## 4. 파일 구조

### 4.1 본문 페이지 (정적)

| 파일 | 내용 |
|---|---|
| `index.html` | 메인. 히어로, 3대 특징, 커리큘럼 요약(7세반~중등부 5단계), 상담 버튼, 푸터 |
| `vision.html` | 비전 & 교육철학 (하브루타, 3대 원칙, 6가지 인재상, 4단계 학습 사이클) |
| `mission.html` | 교육방향 (수업 구조, 자주 묻는 질문) |
| `introduction.html` | 선생님 소개 (사진은 `images/teacher-*.jpg`) |
| `facility.html` | 시설 안내 (`img-facility-01~06.jpg`) |
| `recruit.html` | 강사 채용 |
| `curriculum.html` | 커리큘럼 (`#level1`~`#level5` 앵커 = 7세반, 초1·2, 초3·4, 초5·6, 중등부) + 소포스에듀 안내 |
| `fee.html` | 수업운영 안내, 수업 예약(네이버 예약 링크) |
| `contact.html` | 오시는 길, 연락처 |
| `edu-1.html` | 소포스에듀(이대건T·박효정T 국어 프로그램) 소개. **`style.css`를 쓰는 유일한 페이지** |
| `article-2019.html`, `article-worldview.html` | 기사·칼럼 형태의 읽을거리 |

### 4.2 커뮤니티 게시판

| 파일 | 내용 |
|---|---|
| `board-app.html` | 게시판 전체(약 1,800줄, HTML+CSS+JS 한 파일 SPA). 6장 참고 |
| `board-notice.html`, `board-gallery.html`, `board-review.html`, `board-qna.html` | 10줄짜리 리다이렉트. `board-app.html#notice` 등으로 이동만 시킴. 메뉴 링크는 이 파일들을 가리킴 |

### 4.3 공통 스크립트·스타일

| 파일 | 역할 |
|---|---|
| `mobile.css` | 본문 페이지 공통 반응형 스타일(헤더 햄버거, 모바일 레이아웃 보정). 거의 모든 페이지가 로드 |
| `style.css` | `edu-1.html` 전용 스타일 |
| `nav-mobile.js` | 헤더 하위 메뉴(학원소개/프로그램/커뮤니티) 정의 + 모바일 햄버거 패널. **메뉴 항목을 바꾸려면 여기의 `SUBMENUS`를 수정** |
| `auth-header.js` | 본문 페이지 헤더 오른쪽의 로그인/회원가입/사용자 메뉴. Supabase로 로그인 상태를 읽음 |
| `protect.js` | 복사·우클릭·드래그·개발자도구 경고(저작권 보호). 링크 클릭은 막지 않음 |

### 4.4 기타

| 파일 | 역할 |
|---|---|
| `vercel.json` | `cleanUrls`(확장자 없이 접근), 보안 헤더, 캐시 헤더, `/board` `/notice` `/gallery` `/qna` `/review` → `board-app.html` 재작성 |
| `robots.txt` | Googlebot, 네이버 Yeti 허용 / AI 학습 크롤러와 Baiduspider 차단 / sitemap 위치 |
| `sitemap.xml` | 공개 페이지 목록. **페이지를 추가하면 여기에도 추가** |
| `logo.svg`, `logo.png`, `logo-color.png`, `logo-mono.png` | 로고. `logo.svg`는 캐시 1년 설정 |
| `images/`, `img-facility-*.jpg` | 사진. `img-*` 파일은 1년 캐시(`immutable`)이므로 **같은 이름으로 덮어쓰지 말고 새 이름으로** 올릴 것 |
| `*.pdf` | 입학 신청서, 2019 교육관 자료 |
| `.claude/skills/impeccable/` | 디자인 가이드 스킬 |
| `PRODUCT.md` | 게시판의 사용자·브랜드·디자인 원칙 |

## 5. 페이지 공통 구조의 특징

- **헤더와 푸터에 공통 include가 없습니다.** 각 HTML 파일이 자기 헤더/푸터 마크업을 통째로 가지고 있습니다. 상단 메뉴 문구, 푸터의 주소·전화·사업자 정보, 상담 버튼 링크를 바꿀 때는 **모든 페이지를 검색(`grep`)해서 함께 고쳐야** 합니다.
- 각 페이지 `<head>`에 `<title>`, `meta description`, `canonical`, Open Graph 태그가 들어 있습니다. 새 페이지를 만들면 같은 형식으로 넣고 `sitemap.xml`에도 추가하세요.
- `index.html`에는 JSON-LD(학원 정보)와 Google/Naver 사이트 소유 확인 메타 태그가 있습니다. **지우지 마세요.**
- 글꼴: Pretendard Variable(jsDelivr CDN). 게시판 글 본문만 Noto Serif KR(Google Fonts).
- 색: OKLCH 사용. 링크·강조는 앰버 계열(`oklch(46% 0.14 55)` 부근), 주요 버튼은 검정 바탕/흰 글자. 로고 색은 진보라 `#4B275A`, 연보라 `#D5C1DE`, 왕관 노랑 `#F6E765`.
- 본문 페이지는 최대 폭 1200px, 좌우 여백 32px 기준으로 작성되어 있고, 모바일 보정은 `mobile.css`가 담당.

## 6. 게시판 (`board-app.html`)

### 6.1 구조
- 한 파일 안의 SPA. 화면(`.page`)은 `login`, `register`, `board`, `detail`, `write`, `admin` 여섯 개이고 `go('page', id)`로 전환합니다.
- 게시판 종류(`BOARDS`): `notice`(공지사항, 테이블 `notices`), `gallery`(갤러리, `gallery`), `review`(수강후기, `reviews`).
- 주소로 바로 열기: `board-app?board=notice&post=<글 id>` (글 상세), `board-app#notice` (목록). 화면 전환 시 `history.replaceState`로 주소가 갱신됩니다.
- 글 본문은 `esc()`로 이스케이프한 뒤 `linkify()`로 `http(s)://`, `www.` 주소만 링크로 바꿉니다. **HTML을 그대로 출력하는 코드를 추가하지 마세요(XSS).**

### 6.2 Supabase
- 프로젝트 URL: `https://mcdvxstcondbrwltbuvr.supabase.co` (공개용 `anon` 키가 `board-app.html`, `auth-header.js`에 있음)
- 테이블 (아래는 코드가 사용하는 주요 컬럼이며, 정확한 스키마는 Supabase 대시보드에서 확인)
  - `profiles`: `id`(= auth user id), `display_name`, `role`(`admin`이면 관리자), `is_approved`(승인 여부), `created_at`
  - `notices`: `title`, `content`, `image_urls`, `author_id`, `views`, `created_at`, `updated_at`, **`expires_at`**(게재 기한, 지나면 일반 방문자에게 숨김)
  - `gallery`: `title`, `description`, `image_urls`, `author_id`, `created_at`
  - `reviews`: `title`, `content`, `image_urls`, `author_id`, `user_id`, `author_name`, `is_approved`(관리자 승인 후 공개), `created_at`
  - `comments`, `likes`: `post_table`(`notices`/`gallery`/`reviews`) + `post_id` + `user_id`로 어느 글에 속하는지 구분
- 파일 저장: Storage 버킷 `gallery` (게시글 이미지·영상).
- 권한 규칙 (`canWrite` 로직)
  - 공지사항·갤러리: 관리자만 작성
  - 수강후기: 승인된 회원 또는 관리자 작성, **관리자가 승인해야 목록에 노출**
  - 관리자 화면(`go('admin')`): 회원 승인/취소/삭제, 전체 글 관리
- 관리자 지정: Supabase `profiles` 테이블에서 해당 계정의 `role`을 `admin`으로 변경 (코드 수정 불필요).
- DB 스키마나 RLS 정책을 바꾸려면 Supabase 대시보드 권한이 필요합니다(대표님께 요청).

### 6.3 로그인
- 이메일 가입/로그인(관리자 승인 필요) + **카카오 로그인**(`sb.auth.signInWithOAuth({provider:'kakao'})`).
- Supabase Authentication → URL Configuration의 Site URL은 `https://juniorsolomon.com`, Redirect URL에 `https://juniorsolomon.com/*`가 등록되어 있어야 합니다.
- 카카오 디벨로퍼스 앱 이름 `주니어솔로몬`, 카카오 로그인 Redirect URI는 Supabase 콜백 주소(`.../auth/v1/callback`).
- 화면 하단에 카카오 채널 구독 배너가 고정 표시됩니다(닫기 가능).

## 7. 외부 연동 링크

| 용도 | 위치 |
|---|---|
| 카카오톡 채널(무료 상담 신청) | `http://pf.kakao.com/_xadGxnxb` (채널 ID `_xadGxnxb`) |
| 네이버 예약(수업 예약) | `https://naver.me/GL8Wfrs1` — `fee.html` 전용 |
| 네이버 톡톡 | `https://talk.naver.com/ct/wcal0q?frm=pnmb` |
| 전화 | 02-794-8123(대표), 010-3212-8123(상담) |
| 주소 | 서울 용산구 이촌로 200, LG프라자 4층 403호 |
| 운영시간 | 월~금 14:00~21:00 / 토 09:00~18:00 |

방침: **"무료 상담 신청" 버튼은 카카오톡 채널**로, **수업 예약(`fee.html`)은 네이버 예약**으로 연결합니다. 본문 하단의 "네이버 톡톡 상담" / "카카오톡 채널" 버튼 쌍은 각자 이름에 맞는 주소로 연결합니다.

## 8. 알려진 문제 (정리 대상)

- 헤더/푸터가 페이지마다 복사되어 있어 수정 누락이 생기기 쉽습니다.
- 카카오 채널 추가 팝업(`Kakao.init`)은 JavaScript 키(`board-app.html` 하단)를 쓰며, 카카오 디벨로퍼스 → 앱 → 플랫폼 키 → JavaScript 키 설정에 `https://juniorsolomon.com`, `https://www.juniorsolomon.com`이 JavaScript SDK 도메인으로 등록되어 있어야 동작합니다. 안 되면 채널 페이지를 새 탭으로 여는 대체 동작이 실행됩니다.
- 도메인 `juniorsolomon.com`에 Vercel DNS 설정 경고가 있었습니다. DNS는 가비아, 배포는 Vercel 대시보드에서 확인합니다.

## 9. 작업 체크리스트

- [ ] 모바일(400px)과 데스크톱 모두에서 확인했는가
- [ ] 같은 문구/링크가 다른 페이지에도 있는지 `grep`으로 확인했는가
- [ ] 새 페이지라면 `<title>`, meta, canonical, `sitemap.xml`, 메뉴(`nav-mobile.js`)를 추가했는가
- [ ] 이미지는 용량을 줄였는가(가능하면 200KB 이하), 새 파일명을 썼는가
- [ ] 비밀 정보가 커밋에 섞이지 않았는가
- [ ] PR 설명에 "무엇을, 왜" 바꿨는지 적었는가
