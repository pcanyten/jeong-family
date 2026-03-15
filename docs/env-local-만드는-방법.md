# .env.local 만드는 방법 (에러 해결)

"Your project's URL and Key are required to create a Supabase client!" 에러가 나면,  
Supabase 주소와 키를 프로젝트에 넣어 주면 됩니다.

---

## 1. 파일 만들기

1. **Cursor**에서 왼쪽 폴더 트리 열기
2. **jeong-family** 폴더가 보이면, 그 **안에서** (src 밖, package.json 있는 곳)
3. **새 파일** 만들기 → 이름을 **정확히** ` .env.local ` 로 저장  
   (맨 앞에 점(.) 있고, 중간에 env.local, 확장자 없음)

---

## 2. 안에 넣을 내용

아래 **두 줄**을 그대로 넣되, `여자리에~` 부분만 **Supabase에서 복사한 값**으로 바꿉니다.

```
NEXT_PUBLIC_SUPABASE_URL=여자리에_Supabase_Project_URL_붙여넣기
NEXT_PUBLIC_SUPABASE_ANON_KEY=여자리에_Supabase_Publishable키_또는_anon키_붙여넣기
```

예시 (실제 값은 본인 걸로):

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx...
```

- **NEXT_PUBLIC_SUPABASE_URL**  
  → Supabase 대시보드 **Settings → API** (또는 General) 에서 **Project URL**
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**  
  → 같은 화면에서 **Publishable key** (또는 anon public 키)

- 줄 끝에 **공백이나 따옴표 넣지 마세요.**  
- **등호(=)** 앞뒤에 공백 넣지 마세요.

---

## 3. 저장 후 서버 다시 실행

1. **.env.local** 저장
2. 터미널에서 **Ctrl + C** 로 `npm run dev` 중지
3. 다시 실행:
   ```bash
   npm run dev
   ```
4. 브라우저에서 **http://localhost:3000** 새로고침

이렇게 하면 해당 에러는 사라집니다.
