-- 프로필 읽기가 안 될 때 Supabase SQL Editor에서 실행하세요.
-- "본인 행만 읽기" 정책을 추가/재생성합니다.

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);
