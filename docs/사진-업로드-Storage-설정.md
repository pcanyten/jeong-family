# 사진이 안 올라갈 때 — Supabase Storage 설정

사진 업로드는 **Supabase Storage**에 버킷을 만들어 두어야 합니다. 아래 순서대로 하세요.

---

## 1. 버킷 만들기

1. **Supabase** 대시보드 → 왼쪽 메뉴 **Storage** 클릭
2. **New bucket** 클릭
3. **첫 번째 버킷**
   - Name: **feed** (소문자만)
   - **Public bucket** 체크 (피드에서 사진 공개)
   - **Create bucket**
4. 다시 **New bucket** 클릭
5. **두 번째 버킷**
   - Name: **gallery** (소문자만)
   - **Public bucket** 체크
   - **Create bucket**

---

## 2. 업로드 권한 (Policy) 넣기

버킷만 만들면 기본적으로 업로드가 막혀 있을 수 있습니다. 정책을 추가합니다.

1. **Storage** 왼쪽에서 **feed** 버킷 클릭
2. 오른쪽 위 **Policies** 또는 **New policy** 클릭
3. **For full customization** 또는 **Create policy** 선택 후 아래처럼 설정:

**feed 버킷 — 올리기 허용**

- Policy name: `Allow authenticated upload`
- Allowed operation: **INSERT** (또는 INSERT, UPDATE 체크)
- Target roles: **authenticated**
- USING expression (비워 두거나): `true`
- WITH CHECK expression: `true`

또는 SQL로 한 번에 넣으려면 **SQL Editor**에서 아래 실행:

```sql
-- feed 버킷: 로그인한 사용자 업로드 허용
INSERT INTO storage.policies (name, bucket_id, definition)
SELECT 'Allow authenticated upload', id, '(auth.role() = ''authenticated'')'
FROM storage.buckets WHERE name = 'feed'
ON CONFLICT DO NOTHING;
```

Supabase 새 UI에서는 **Storage → feed → Policies → New policy**에서:
- **Policy name**: Allow authenticated upload
- **Policy definition**: `(auth.role() = 'authenticated')`
- **Allowed operations**: INSERT, UPDATE (또는 필요한 것만)

**gallery 버킷**도 같은 방식으로 한 번 더 만듭니다 (버킷 이름만 gallery).

---

## 3. 간단 방법 (Supabase UI)

1. **Storage** → **feed** 클릭
2. **Policies** 탭 → **New policy**
3. **Get started quickly** 에서 **Allow public read, authenticated upload** 같은 템플릿이 있으면 선택
4. 없으면 **Custom** 으로:
   - Operation: **INSERT**, **SELECT** (또는 All)
   - Role: **authenticated**
   - Expression: `true`
5. **gallery** 버킷에도 동일하게 한 번 더 적용

---

## 4. 확인

- **피드**에서 **[+]** → 사진 올리기 → 사진 선택 후 **올리기**
- **사진첩**에서 앨범 열고 **사진 올리기**

이때 빨간 에러 문구가 나오면 그 메시지를 그대로 복사해 두고, 위 설정(버킷 이름, Public 여부, Policy)을 다시 확인하면 됩니다.
