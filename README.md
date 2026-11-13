# handeulpan-frontend

🐑 **한 들판** 모바일 웹앱(PWA) 프론트엔드 — 2026 간지톤 14팀

들판 링크 하나로 설치 없이 합류하고, 하루 한 번 내 양을 쓰다듬는 앱입니다.
양의 상태는 서버가 계산하고, 앱은 받은 상태를 들판 위치와 모습으로 그립니다.

## 스택

| 영역 | 선택 |
|---|---|
| 프레임워크 | React + Vite (TypeScript) |
| 앱 형태 | PWA (설치 없이 링크로 입장) |
| 스타일 | Tailwind CSS (Vite 플러그인) |
| 상태 관리 | Zustand |
| 들판 렌더링 | SVG·이미지 + CSS transition (필요하면 Framer Motion) |
| 인증 | 기기 토큰(UUID)을 브라우저에 저장, 요청 헤더로 전송 |
| 배포 | Vercel (`main` → 운영) |

> 프로젝트 초기 세팅(Vite·PWA·라우팅)은 FE-B가 이 레포에 올립니다.

## 실행 방법

### 요구 사항

- Node.js 24 (`.nvmrc`)
- pnpm 10 (`package.json`의 `packageManager`)

pnpm이 없다면 Node에 들어 있는 corepack으로 켭니다.

```bash
corepack enable
```

### 설치 및 실행

```bash
git clone https://github.com/ganjithon-14/handeulpan-frontend
cd handeulpan-frontend
pnpm install
cp .env.example .env
pnpm dev
```

브라우저에서 `http://localhost:5173`을 엽니다. 화면은 393×852(Figma 기준)에 맞춰 만들므로, 개발자 도구의 모바일 화면으로 확인합니다.

### 스크립트

| 명령 | 설명 |
|---|---|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 타입 검사 후 `dist/`로 빌드 |
| `pnpm preview` | 빌드 결과 미리 보기 |
| `pnpm lint` | ESLint 검사 |
| `pnpm format` | Prettier로 전체 포맷 |
| `pnpm format:check` | 포맷이 맞는지 검사만 |
| `pnpm typecheck` | TypeScript 타입 검사 |
| `pnpm generate-pwa-assets` | `public/logo.svg`로 PWA 아이콘·파비콘 다시 만들기 (로고가 바뀌었을 때만) |

PR을 올리기 전에 `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm build`가 모두 통과하는지 확인합니다.

## 환경 변수

민감 정보는 저장소에 올리지 않습니다. `.env.example`을 복사해 프로젝트 루트에 `.env`(git 제외)를 만들어 설정하세요.

| 변수 | 설명 |
|---|---|
| `VITE_API_URL` | 백엔드 API 서버 주소 (기본값 `https://handeulpan.p-e.kr`) |
| `VITE_USE_MOCK` | 목업 API 사용 여부 (`true`/`false`) |

> `VITE_` 접두사가 붙은 값은 브라우저 번들에 포함되므로, 비밀 키는 절대 넣지 않습니다.
>
> 새 변수를 추가하면 `.env.example`과 `src/vite-env.d.ts`의 타입도 같이 고칩니다.

### 목업 모드

`VITE_USE_MOCK=true`면 서버에 요청하지 않고 `src/api/mock/`이 백엔드 `docs/api` 예시 응답을 돌려줍니다. 서버가 없거나 API가 아직 안 나왔을 때 화면을 만들 수 있습니다.

- 토큰 없이 로그인이 필요한 API를 부르면 `401 INVALID_DEVICE_TOKEN` → 로그인 화면으로 이동
- 들판 id `mock-full`: 미리보기는 가득 찬 들판, 합류는 `409 PASTURE_FULL`
- 내 양(id 1)에게 목도리 보내기: `400 SELF`
- 말풍선에 `죽고싶`이 들어 있으면 위험 키워드 응답(`posted: false, flagged: true`)

## 담당 영역

| 파트 | 담당 | 폴더 (제안) | 범위 |
|---|---|---|---|
| FE-A · 들판 | [@Taemin217](https://github.com/Taemin217) | `src/features/field/` | 들판 메인 화면, 양 배치·이동, 상태별 표현(가운데·산책·가장자리), 쓰다듬기 반응, 말풍선 표시, 목도리 연출, 돌아옴 환영, 멀어짐 배너 |
| FE-B · 흐름 | [@seunguk925](https://github.com/seunguk925) | `src/app/`, `src/pages/`, `src/api/`, `src/stores/`, 그 밖의 `src/features/*` | 프로젝트·PWA·라우팅·API 연동, 홈, 초대 랜딩, 양 만들기·동의, 말풍선 입력, 다가가기 창, 목도리 고르기 창, 도움 안내 카드, 데모 패널, Vercel 배포 |
| 공동 | 둘 다 | `src/shared/`, `public/assets/` | 공통 컴포넌트, 디자인 에셋 |

폴더 이름은 프로젝트 세팅 때 바뀌면 이 표도 같이 고쳐 주세요. 이름 규칙은 [용어표](https://github.com/ganjithon-14/.github/blob/main/CONTRIBUTING.md#5-용어-코드-이름-통일)를 따릅니다.

## 코드 스타일

- **Prettier**와 **ESLint**(flat config)를 사용하고, 둘이 겹치는 규칙은 `eslint-config-prettier`로 끕니다.
- 세미콜론 사용, 싱글 쿼트 사용, 들여쓰기 4칸, 한 줄 100자, 여러 줄일 때 끝에 쉼표
- Tailwind 클래스 순서는 `prettier-plugin-tailwindcss`가 자동으로 정렬합니다.
- 줄바꿈은 LF로 고정합니다. (`.gitattributes`, `.editorconfig`)
- import는 `@/`(= `src/`) 경로 별칭을 사용합니다. 예) `import App from '@/App.tsx'`
- 컴포넌트는 `PascalCase`, 함수·변수는 `camelCase`, 상수는 `UPPER_SNAKE_CASE`
- 커스텀 훅은 `use`로 시작합니다. (예: `useSheepPosition`)
- 색상·폰트는 `src/index.css`의 `@theme` 토큰을 씁니다. 임의 색(`bg-[#604620]`)은 쓰지 않습니다.

| 토큰 | 클래스 예 | 값 |
|---|---|---|
| 주 버튼 갈색 | `bg-primary` | `#604620` |
| 크림 배경 | `bg-cream` | `#fffdf8` |
| 털 색 (`woolColor`) | `bg-wool-cream` `bg-wool-pink` `bg-wool-yellow` `bg-wool-mint` `bg-wool-sky` `bg-wool-lavender` | `#f5e7c9` `#f3c8c7` `#f1d98b` `#b9d9c3` `#bbd8de` `#cbc4db` |
| 폰트 | `font-sans`(기본) `font-batang` `font-dodum` | Pretendard, 고운바탕, 고운돋움 |

VS Code를 쓴다면 추천 확장(ESLint, Prettier, Tailwind CSS IntelliSense, EditorConfig)을 설치하면 저장할 때 자동으로 포맷됩니다.

## 브랜치

- `main` 배포 / `dev` 통합(기본) / `feat/fe-a-{이슈}-{설명}`, `feat/fe-b-{이슈}-{설명}`
- `dev`, `main`은 PR + 승인 1명이 있어야 머지됩니다. 리뷰어는 같은 파트의 다른 한 명입니다.
- 자세한 규칙: [CONTRIBUTING.md](https://github.com/ganjithon-14/.github/blob/main/CONTRIBUTING.md)

## 관련 레포

- 백엔드 API 명세: [handeulpan-backend/docs/api](https://github.com/ganjithon-14/handeulpan-backend/tree/dev/docs/api)
- 디자인 에셋: [handeulpan-design](https://github.com/ganjithon-14/handeulpan-design)
