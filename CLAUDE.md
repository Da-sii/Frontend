# CLAUDE.md

다시(dasii) — React Native + Expo 기반 건강기능식품 리뷰 모바일 앱.

## 기술 스택

- **프레임워크**: Expo (SDK 54) + expo-router (파일 기반 라우팅)
- **언어**: TypeScript (strict)
- **스타일**: NativeWind v2 (Tailwind CSS) — `tailwind.config.js`
- **서버 상태**: TanStack Query (React Query 5)
- **클라이언트 상태**: Zustand
- **HTTP**: Axios (`services/index.ts` — accessToken 인터셉터 / 401 리프레시 큐)
- **패키지 매니저**: pnpm

## 명령어

- `pnpm start` — Metro 개발 서버
- `pnpm ios` / `pnpm android` — 네이티브 실행
- `pnpm web` — 웹 실행
- `pnpm lint` — ESLint
- 테스트 프레임워크는 아직 없음 (로직은 순수 `utils/`·`services/` 모듈로 분리해 추후 도입 대비)

## 디렉토리 구조

- `app/` — expo-router 라우트. `app/(tabs)/` 가 하단 탭(홈 · 카테고리 · 나의 기록 · 마이페이지). 각 탭은 폴더 + `_layout.tsx`(Stack) + `index.tsx` 구조.
- `components/` — `common/`(버튼·모달·인풋 등 공용), `page/<도메인>/`(화면별 컴포넌트)
- `services/` — API 레이어 (도메인별 파일, `axiosInstance` 사용)
- `hooks/` — React Query 훅 (`useQuery` / `useInfiniteQuery` / `useMutation`)
- `store/` — Zustand UI 상태
- `types/` — `models/`(`I*` 인터페이스), `payloads/`(`*Payload`), `responses/`(`*Response`)
- `utils/`, `constants/`, `assets/`(SVG 아이콘은 컴포넌트로 import)

## 코드 컨벤션

- **스타일은 NativeWind `className`** 으로 작성. 색상/폰트/사이즈 값의 기준은 `tailwind.config.js` (`constants/color.ts` 에는 일부 오타가 있으니 색상은 tailwind config 기준).
- 폰트: `font-n-lt`(Light) · `font-n-rg`(Regular) · `font-n-bd`(Bold) · `font-n-eb`(ExtraBold). 사이즈: `h-*`(헤딩) · `b-*`(본문) · `c1`/`c2`/`c3`(캡션).
- 타입 네이밍: 모델 `I*`, 요청 `*Payload`, 응답 `*Response`.
- 데이터 흐름: services(API) → hooks(React Query) → 화면. 서버 상태는 React Query, UI 상태만 Zustand.
- UI 텍스트는 한국어.
- 경로 별칭 `@/*` = 프로젝트 루트.

## 공용 UI 컴포넌트 (재사용 우선)

- `components/common/buttons/LongButton.tsx` — 전체폭 버튼 (`label`/`onPress`/`disabled`/`height`)
- `components/common/modals/DefaultModal.tsx` — 확인/취소 모달 (`visible`/`title`/`message`/`onConfirm`/`onCancel`/`children`/`singleButton`)
- `components/common/Inputs/TextField.tsx` · `TextInput.tsx` — 검증 인풋
- `components/page/product/productDetail/BottomSheet/BottomSheetLayout.tsx` — `@gorhom/bottom-sheet` 래퍼. 사용 화면 하단에 `<PortalHost name='overlay-top' />` 필요, 열기는 `sheetRef.current?.snapToIndex(0)`.

## Git 워크플로우

- GitHub 이슈마다 대응하는 origin 브랜치가 있고 브랜치명에 이슈번호가 들어간다 (예: `feat/#197-graph-component`).
- 여러 이슈에 걸친 작업은 한 브랜치에 몰지 말고 각 이슈 브랜치에 나눠 커밋한다. 공용 코드 의존이 있으면 브랜치를 스택으로 쌓고 PR base를 앞 브랜치로 지정.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`Da-sii/Frontend`) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout (`CONTEXT.md` + `docs/adr/` at the repo root). See `docs/agents/domain.md`.
