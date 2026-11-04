# handeulpan-frontend

🐑 **한 들판** 모바일 웹앱(PWA) 프론트엔드 — 2026 간지톤 14팀

들판 링크 하나로 설치 없이 합류하고, 하루 한 번 내 양을 쓰다듬는 앱입니다.
양의 상태는 서버가 계산하고, 앱은 받은 상태를 들판 위치와 모습으로 그립니다.

## 스택

| 영역 | 선택 |
|---|---|
| 프레임워크 | React + Vite |
| 앱 형태 | PWA (설치 없이 링크로 입장) |
| 상태 관리 | Zustand |
| 들판 렌더링 | SVG·이미지 + CSS transition (필요하면 Framer Motion) |
| 인증 | 기기 토큰(UUID)을 브라우저에 저장, 요청 헤더로 전송 |
| 배포 | Vercel (`main` → 운영) |

> 프로젝트 초기 세팅(Vite·PWA·라우팅)은 FE-B가 이 레포에 올립니다.

## 담당 영역

| 파트 | 담당 | 폴더 (제안) | 범위 |
|---|---|---|---|
| FE-A · 들판 | [@Taemin217](https://github.com/Taemin217) | `src/features/field/` | 들판 메인 화면, 양 배치·이동, 상태별 표현(가운데·산책·가장자리), 쓰다듬기 반응, 말풍선 표시, 목도리 연출, 돌아옴 환영, 멀어짐 배너 |
| FE-B · 흐름 | [@seunguk925](https://github.com/seunguk925) | `src/app/`, `src/pages/`, `src/api/`, `src/stores/`, 그 밖의 `src/features/*` | 프로젝트·PWA·라우팅·API 연동, 홈, 초대 랜딩, 양 만들기·동의, 말풍선 입력, 다가가기 창, 목도리 고르기 창, 도움 안내 카드, 데모 패널, Vercel 배포 |
| 공동 | 둘 다 | `src/shared/`, `public/assets/` | 공통 컴포넌트, 디자인 에셋 |

폴더 이름은 프로젝트 세팅 때 바뀌면 이 표도 같이 고쳐 주세요. 이름 규칙은 [용어표](https://github.com/ganjithon-14/.github/blob/main/CONTRIBUTING.md#5-용어-코드-이름-통일)를 따릅니다.

## 브랜치

- `main` 배포 / `dev` 통합(기본) / `feat/fe-a-{이슈}-{설명}`, `feat/fe-b-{이슈}-{설명}`
- `dev`, `main`은 PR + 승인 1명이 있어야 머지됩니다. 리뷰어는 같은 파트의 다른 한 명입니다.
- 자세한 규칙: [CONTRIBUTING.md](https://github.com/ganjithon-14/.github/blob/main/CONTRIBUTING.md)

## 관련 레포

- 백엔드 API 명세: [handeulpan-backend/docs/api](https://github.com/ganjithon-14/handeulpan-backend/tree/dev/docs/api)
- 디자인 에셋: [handeulpan-design](https://github.com/ganjithon-14/handeulpan-design)
