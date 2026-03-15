# GitHub에 jeong-family 올리기 (초보용)

저장소 주소: **https://github.com/pcanyten/jeong-family**

---

## 1단계: 터미널 열기

- **Mac**: `Cmd + Space` 누르고 "터미널" 또는 "Terminal" 입력 후 엔터
- 또는 Cursor/VS Code 아래쪽 **터미널(Terminal)** 탭 클릭

---

## 2단계: 프로젝트 폴더로 이동

아래 명령어를 **그대로 복사**해서 터미널에 붙여넣고 **엔터** 치세요.

```bash
cd "/Users/pcany/Desktop/개인 프로젝트/jeong-family"
```

(이제 이 폴더가 "현재 위치"가 됩니다.)

---

## 3단계: Git 저장소 만들기 (처음 한 번만)

아래 명령어를 **한 줄씩** 입력하고 매번 **엔터**를 치세요.

### 3-1. Git 초기화
```bash
git init
```
→ "Initialized empty Git repository in ..." 같은 메시지가 나오면 성공입니다.

### 3-2. 모든 파일 스테이징 (올릴 파일 고르기)
```bash
git add .
```
→ 아무 메시지 없이 다음 줄로 넘어가면 정상입니다.

### 3-3. 첫 커밋 (첫 번째 "저장" 만들기)
```bash
git commit -m "첫 커밋: 정씨네 이야기 앱"
```
→ "X files changed" 같은 메시지가 나오면 성공입니다.

**참고**: `.env.local`(비밀키 들어 있는 파일)은 `.gitignore`에 있어서 **절대 올라가지 않습니다.** 그대로 두면 됩니다.

---

## 4단계: 브랜치 이름을 main으로 맞추기

```bash
git branch -M main
```

(엔터만 치면 됩니다. GitHub 기본 브랜치 이름이 main이라서 맞춰 주는 겁니다.)

---

## 5단계: GitHub 저장소 연결

```bash
git remote add origin https://github.com/pcanyten/jeong-family.git
```

한 번만 하면 됩니다. "origin"이라는 이름으로 위 주소가 붙었다는 뜻입니다.

---

## 6단계: GitHub에 올리기 (push)

```bash
git push -u origin main
```

여기서 **처음이면 로그인을 요구**할 수 있습니다.

- **비밀번호 대신** GitHub에서는 **Personal Access Token**을 씁니다.
- 아직 토큰이 없다면:
  1. GitHub 웹사이트 로그인 → 우측 상단 프로필 클릭
  2. **Settings** → 왼쪽 맨 아래 **Developer settings**
  3. **Personal access tokens** → **Tokens (classic)** → **Generate new token**
  4. Note에 "jeong-family" 같은 이름 적고, **repo** 권한 체크
  5. 생성된 토큰을 **복사**해 두기 (한 번만 보여 줍니다!)
- 터미널에서 "Password"라고 나오면 **비밀번호 말고 이 토큰**을 붙여넣고 엔터

성공하면 `main -> main` 같은 메시지와 함께 수십 초 안에 올라갑니다.

---

## 7단계: 확인

브라우저에서 **https://github.com/pcanyten/jeong-family** 새로고침해 보세요.  
폴더/파일들이 보이면 **완료**입니다.

---

## 한 번에 복사해서 쓸 명령어 (요약)

이미 터미널을 열고 `cd "/Users/pcany/Desktop/개인 프로젝트/jeong-family"` 까지 했다면, 아래만 순서대로 실행해도 됩니다.

```bash
git init
git add .
git commit -m "첫 커밋: 정씨네 이야기 앱"
git branch -M main
git remote add origin https://github.com/pcanyten/jeong-family.git
git push -u origin main
```

---

## 나중에 코드 수정했을 때 다시 올리는 방법

수정한 뒤에 다시 GitHub에 반영하려면:

```bash
cd "/Users/pcany/Desktop/개인 프로젝트/jeong-family"
git add .
git commit -m "수정 내용 한 줄 설명"
git push
```

이렇게 하면 같은 저장소에 계속 업데이트됩니다.
