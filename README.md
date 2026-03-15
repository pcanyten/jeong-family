# 정씨네 이야기

가족만을 위한 폐쇄형 모바일 웹 서비스입니다.

## 기술 스택

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (Mobile-first)
- **Icons:** Lucide React
- **Auth & DB:** Supabase (Auth + Database + Storage)

## 디자인

- **Primary:** #FF8C69 (Coral)
- **Background:** #FEFDF5 (Ivory)
- **Text:** #4A4A4A (Dark Gray)
- **Typography:** Noto Sans KR, 16px 이상 (어르신 가독성)

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local
# .env.local에 Supabase URL과 anon key 입력
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

## Supabase 설정

### 1. 프로젝트 생성

[Supabase](https://supabase.com)에서 새 프로젝트를 만든 뒤, **SQL Editor**에서 `supabase/schema.sql` 내용을 전체 실행합니다.

### 2. 환경 변수

`.env.local`에 다음을 설정합니다.

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Storage 버킷

Supabase 대시보드 → **Storage**에서 다음 버킷을 **Public**으로 생성합니다.

- `feed` – 메인 피드 사진
- `gallery` – 사진첩 사진

각 버킷에 대해 **Policies**에서 승인된 사용자만 읽기/쓰기 가능하도록 RLS 정책을 추가하세요. (예: `auth.uid()` 존재 시 허용)

### 4. 최초 관리자 지정

가입한 첫 번째 계정을 관리자로 쓰려면 Supabase **Table Editor** → `profiles`에서 해당 사용자 행의 `is_approved`와 `is_admin`을 `true`로 수정합니다. 이후 해당 계정으로 로그인하면 하단에 **회원 관리** 메뉴가 보이고, 다른 가족 계정을 승인할 수 있습니다.

## 폴더 구조

```
src/
├── app/
│   ├── (auth)/          # 로그인, 가입, 승인 대기
│   │   ├── login/
│   │   ├── signup/
│   │   └── waiting/
│   ├── (main)/          # 승인된 사용자 전용
│   │   ├── page.tsx     # 메인 피드
│   │   ├── calendar/
│   │   ├── gallery/
│   │   └── admin/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── feed/            # D-Day 바, 피드 카드, FAB, 댓글
│   ├── calendar/        # 달력, 일정 CRUD
│   ├── gallery/         # 앨범 목록, 사진 그리드
│   ├── admin/           # 회원 목록, 승인
│   └── layout/          # 하단 네비, 헤더
├── lib/
│   └── supabase/        # 서버/클라이언트/미들웨어
└── types/
    └── database.ts
```

## 접근 제어

- **비로그인:** 모든 보호된 경로 접근 시 `/login`으로 리다이렉트
- **로그인 + 미승인(`is_approved: false`):** `/waiting`만 접근 가능, “관리자의 승인을 기다리고 있습니다” 안내
- **로그인 + 승인:** 메인 피드, 일정, 사진첩 이용 가능
- **로그인 + 승인 + 관리자(`is_admin: true`):** 하단에 **회원 관리** 메뉴 표시, 가입 대기자 승인 가능

## 기능 요약

| 화면 | 기능 |
|------|------|
| 메인 피드 | D-Day 스티키 바, 사진/본문 피드, 좋아요·댓글, FAB(사진 올리기/일정 등록) |
| 일정 | 월간 달력, 해당 월 일정 목록, 일정 등록/수정/삭제 |
| 사진첩 | 연도별 앨범, 앨범 추가, 3열 그리드 사진, 사진 올리기 |
| 회원 관리 | 가입 대기 목록, 승인 버튼으로 `is_approved` true 변경 |
