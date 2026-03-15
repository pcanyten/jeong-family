# Vercel로 배포하기 (초보용)

GitHub에 코드를 올렸다면, 이제 **Vercel**에 올려서 누구나 접속할 수 있는 주소를 만듭니다.

---

## 준비물

- ✅ GitHub에 올린 **jeong-family** 저장소 (이미 완료)
- ✅ 로컬에 있는 **.env.local** 파일 (환경 변수 값 복사할 때 필요)

---

## 1단계: Vercel 가입하기

1. 브라우저에서 **https://vercel.com** 접속
2. 우측 상단 **Sign Up** 클릭
3. **Continue with GitHub** 선택
4. GitHub 로그인되어 있으면 권한 요청 나옴 → **Authorize Vercel** (허용) 클릭
5. 가입 완료되면 Vercel 대시보드로 이동

---

## 2단계: 새 프로젝트 만들기

1. Vercel 대시보드에서 **Add New...** 버튼 클릭
2. **Project** 선택
3. **Import Git Repository** 화면이 나옴
4. 목록에서 **pcanyten/jeong-family** 찾아서 **Import** 클릭  
   (안 보이면 "Adjust GitHub App Permissions"로 가서 저장소 권한 허용 후 다시 시도)

---

## 3단계: 프로젝트 설정 (대부분 그대로 두기)

- **Project Name**: `jeong-family` (그대로 두면 됨)
- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: 비워 두기
- **Build and Output Settings**: 건드리지 않기

**지금은 Deploy 버튼 누르지 말고**, 아래 4단계 먼저 합니다.

---

## 4단계: 환경 변수 넣기 (가장 중요)

화면을 조금 아래로 내리면 **Environment Variables** 섹션이 있습니다.

로컬 컴퓨터의 **.env.local** 파일을 열어서 아래 세 값을 확인하세요.  
(Cursor에서 `jeong-family` 폴더 열고 `.env.local` 파일 클릭)

### 넣어야 할 변수 3개

| Name (이름) | Value (값) | 어디서 복사? |
|-------------|------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` 형태 | .env.local의 NEXT_PUBLIC_SUPABASE_URL= 뒤에 있는 주소 전체 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 긴 영문+숫자 문자열 | .env.local의 NEXT_PUBLIC_SUPABASE_ANON_KEY= 뒤에 있는 값 전체 |
| `SUPABASE_SERVICE_ROLE_KEY` | 긴 영문+숫자 문자열 | .env.local의 SUPABASE_SERVICE_ROLE_KEY= 뒤에 있는 값 전체 |

### Vercel에 입력하는 방법

1. **Key** 칸에 `NEXT_PUBLIC_SUPABASE_URL` 입력
2. **Value** 칸에 .env.local에서 복사한 URL 붙여넣기
3. **Add** 또는 체크 버튼 클릭
4. 같은 방식으로 **NEXT_PUBLIC_SUPABASE_ANON_KEY** 추가
5. 같은 방식으로 **SUPABASE_SERVICE_ROLE_KEY** 추가

⚠️ **주의**: Value에 공백이나 따옴표가 들어가면 안 됩니다. 복사할 때 앞뒤 공백 없이 값만 넣으세요.

세 개 다 넣었는지 확인한 뒤 다음 단계로 갑니다.

---

## 5단계: 배포 버튼 누르기

1. **Deploy** 버튼 클릭
2. "Building..." / "Deploying..." 진행되는 동안 1~2분 기다리기
3. 완료되면 **Congratulations** 화면과 함께 **Visit** 버튼이 나옴

---

## 6단계: 배포 주소 확인

- **Visit** 클릭하면 새 탭에서 실제로 올라간 사이트가 열립니다.
- 주소는 대략 **https://jeong-family-xxxx.vercel.app** 같은 형태입니다.
- 이 주소를 가족 분들께 보내면 접속할 수 있습니다.

---

## 7단계: Supabase에서 로그인 허용 (필수)

배포된 주소에서 **로그인/회원가입**이 되려면, Supabase에 "이 주소에서 로그인해도 된다"고 등록해야 합니다.

1. **https://supabase.com/dashboard** 접속 후 로그인
2. **정씨네 이야기**에 쓰는 프로젝트 선택
3. 왼쪽 메뉴 **Authentication** 클릭
4. **URL Configuration** 클릭
5. **Redirect URLs** 항목 찾기
   - **Add URL** 클릭
   - Vercel에서 나온 주소 입력 (예: `https://jeong-family-xxxx.vercel.app`)
   - 끝에 `/**` 붙이기 → `https://jeong-family-xxxx.vercel.app/**`
   - 저장
6. **Site URL** 항목을 같은 주소로 바꾸기  
   (예: `https://jeong-family-xxxx.vercel.app` — 끝에 `/` 없이, `/**` 없이)
7. **Save** 클릭

이렇게 해두면 배포된 사이트에서도 로그인·회원가입이 정상 동작합니다.

---

## 8단계: 실제로 확인해 보기

1. 시크릿/프라이빗 창을 열고
2. 배포된 주소(예: https://jeong-family-xxxx.vercel.app) 접속
3. 로그인·회원가입이 되는지, 피드가 보이는지 확인

---

## 요약 체크리스트

- [ ] Vercel 가입 (GitHub로)
- [ ] Add New → Project → jeong-family Import
- [ ] 환경 변수 3개 입력 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- [ ] Deploy 클릭 후 배포 완료까지 대기
- [ ] Supabase → Authentication → URL Configuration에서 Redirect URL + Site URL 설정
- [ ] 배포 주소로 접속해서 로그인/피드 확인

---

## 나중에 코드 수정했을 때

코드를 고치고 GitHub에 `git push`만 하면, Vercel이 자동으로 다시 빌드해서 배포합니다.  
별도로 "다시 올리기" 버튼을 누를 필요 없습니다.

---

## 문제가 생겼을 때

- **빌드 실패**: Vercel 프로젝트 → **Deployments** → 실패한 항목 클릭 → **Building** 로그 확인. 대부분 환경 변수 이름 오타나 누락입니다.
- **로그인 안 됨**: Supabase **Redirect URLs**에 배포 주소가 `https://...vercel.app/**` 형태로 들어갔는지, **Site URL**도 맞는지 다시 확인하세요.
