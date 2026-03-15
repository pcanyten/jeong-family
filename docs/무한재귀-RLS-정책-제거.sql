-- "infinite recursion detected in policy for relation profiles" 오류 해결
-- Supabase SQL Editor에서 이 한 줄만 실행하세요.

DROP POLICY IF EXISTS "profiles_select_approved" ON public.profiles;
