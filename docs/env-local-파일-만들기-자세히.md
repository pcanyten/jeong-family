# .env.local 파일 만드는 방법 (자세히)

**터미널에서 만들 필요 없어요.**  
**Cursor(또는 Finder)에서 만드시면 됩니다.** 아래에서 편한 방법 하나만 따라 하세요.

---

## 방법 1. Cursor에서 만들기 (가장 추천)

이미 Cursor로 jeong-family 프로젝트를 열어 두었다면 이 방법이 제일 쉽습니다.

### 1단계: 새 파일 만들기

1. Cursor **왼쪽**에 **파일 목록(Explorer)** 이 보이게 하기  
   - 안 보이면 상단 메뉴 **View(보기)** → **Explorer** 클릭
2. **jeong-family** 폴더 이름 옆 **파일 아이콘**(또는 폴더 옆 빈 곳)을 보기  
   - **package.json**, **src** 폴더가 있는 **맨 위 jeong-family** 가 “프로젝트 폴더”입니다
3. **jeong-family** 폴더를 **우클릭**
4. **New File** (새 파일) 선택
5. 이름을 **정확히** 입력: **`.env.local`**  
   - 맨 앞에 **점(.)** 꼭 넣기  
   - 점 다음에 **env.local** (확장자 없음)  
   - 예: `.env.local` ✅ / `env.local` ❌

### 2단계: 내용 넣기

1. 새로 생긴 **.env.local** 파일이 열리면, 아래 **두 줄**을 **그대로** 붙여넣기
2. **등호(=) 뒤**만 **Supabase에서 복사한 값**으로 바꾸기

```
NEXT_PUBLIC_SUPABASE_URL=여기에_Supabase_Project_URL_붙여넣기
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_Supabase_Publishable키_붙여넣기
```

예시 (본인 값으로 바꿔서):

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxx
```

- 등호 앞뒤에 **공백 넣지 마세요**
- 값에 **따옴표 넣지 마세요**

### 3단계: 저장

- **Ctrl + S** (Mac: **⌘ + S**) 로 저장

이제 터미널에서 **npm run dev** 다시 실행한 뒤 브라우저에서 **http://localhost:3000** 새로고침하면 됩니다.

---

## 방법 2. Mac Finder에서 만들기

Cursor를 쓰지 않고, **Finder**에서만 하고 싶다면 아래처럼 하세요.

### 1단계: 프로젝트 폴더 열기

1. **Finder** 열기
2. **바탕화면(Desktop)** → **개인 프로젝트** → **jeong-family** 폴더 더블클릭해서 열기  
   - 안에 **package.json**, **src** 폴더가 보여야 합니다

### 2단계: 텍스트 파일로 내용 만들기

1. **TextEdit(텍스트 편집)** 앱 열기  
   - Spotlight(⌘+Space)에 "텍스트 편집" 또는 "TextEdit" 검색
2. 메뉴 **Format(서식)** → **Make Plain Text(일반 텍스트 만들기)** 선택  
   - 반드시 **일반 텍스트**로 해야 합니다
3. 아래 두 줄 입력 (등호 뒤는 본인 Supabase 값으로):

```
NEXT_PUBLIC_SUPABASE_URL=여기에_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_Publishable키
```

4. **파일** → **저장(Save)** 클릭
5. **저장 위치**를 **jeong-family** 폴더로 선택  
   - "Where" 또는 "위치"에서 Desktop → 개인 프로젝트 → jeong-family 선택
6. **이름**을 **`.env.local`** 로 입력  
   - 맨 앞에 **점(.)** 꼭 넣기
7. **저장** 클릭

이렇게 하면 **jeong-family** 안에 `.env.local` 파일이 생깁니다.  
이후 터미널에서 **npm run dev** 다시 실행하고 브라우저 새로고침하면 됩니다.

---

## 방법 3. 터미널에서 만들기

**파일만** 터미널로 만들고, **내용은 Cursor에서** 넣어도 됩니다.

### 1단계: 프로젝트 폴더로 이동

터미널에서:

```bash
cd "/Users/pcany/Desktop/개인 프로젝트/jeong-family"
```

### 2단계: 빈 파일 만들기

```bash
touch .env.local
```

이렇게 하면 **jeong-family** 안에 빈 **.env.local** 파일이 생깁니다.

### 3단계: 내용 넣기

- **Cursor** 왼쪽 파일 목록에서 **.env.local** 을 클릭해서 열고  
- 방법 1의 "2단계: 내용 넣기"처럼 두 줄 넣고 저장하면 됩니다.

---

## 정리

| 방법 | 어디서 하나요 | 추천 |
|------|----------------|------|
| **Cursor** | Cursor 왼쪽에서 새 파일 `.env.local` 만들고 내용 입력 | ✅ 가장 쉬움 |
| **Finder** | TextEdit로 내용 쓰고 jeong-family 폴더에 `.env.local` 이름으로 저장 | 가능 |
| **터미널** | `touch .env.local` 로 파일만 만들고, 내용은 Cursor에서 입력 | 가능 |

**파일을 터미널에서 만들어야 하는 건 아니에요.**  
**Cursor에서 새 파일 이름을 `.env.local` 로 하고 내용 넣는 것만 해도 됩니다.**
