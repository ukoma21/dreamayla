-- Lock down every application table exposed through the public schema.
-- No policies are added: PostgREST roles (anon/authenticated) are therefore
-- denied by default, while the existing server-side Prisma connection remains
-- unchanged. Do not use FORCE ROW LEVEL SECURITY here.

ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Dream" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DreamSymbol" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DreamEmotion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DreamPattern" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DreamConversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CreditTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SEOPage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BlogPost" ENABLE ROW LEVEL SECURITY;
