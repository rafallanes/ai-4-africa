import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

const Auth = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/admin");
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setBusy(false);
    if (error) {
      toast({ title: t("auth.loginFailed"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("auth.welcome") });
      navigate("/admin");
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signUp({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    if (error) {
      toast({ title: t("auth.signupFailed"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("auth.created"), description: t("auth.createdDesc") });
    }
  };

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.resetPasswordForEmail(String(fd.get("email")), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("auth.emailSent"), description: t("auth.emailSentDesc") });
      setForgotMode(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="Sign in — AI 4 Africa" description="Admin sign in for AI 4 Africa" path="/auth" />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
            <h1 className="text-3xl font-bold">{t("auth.title")}</h1>
            <p className="text-muted-foreground">{t("auth.subtitle")}</p>
          </div>

          {forgotMode ? (
            <Card>
              <CardHeader>
                <CardTitle>{t("auth.reset")}</CardTitle>
                <CardDescription>{t("auth.resetDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgot} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="femail">{t("auth.email")}</Label>
                    <Input id="femail" name="email" type="email" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? t("auth.sending") : t("auth.sendReset")}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => setForgotMode(false)}>
                    {t("auth.backToSignIn")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t("auth.signIn")}</TabsTrigger>
                <TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="lemail">{t("auth.email")}</Label>
                        <Input id="lemail" name="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lpassword">{t("auth.password")}</Label>
                        <Input id="lpassword" name="password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full" disabled={busy}>
                        {busy ? t("auth.signingIn") : t("auth.signIn")}
                      </Button>
                      <Button type="button" variant="link" className="w-full" onClick={() => setForgotMode(true)}>
                        {t("auth.forgot")}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="signup">
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="semail">{t("auth.email")}</Label>
                        <Input id="semail" name="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spassword">{t("auth.password")}</Label>
                        <Input id="spassword" name="password" type="password" required minLength={8} />
                      </div>
                      <Button type="submit" className="w-full" disabled={busy}>
                        {busy ? t("auth.creating") : t("auth.create")}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/" className="hover:underline">{t("auth.backHome")}</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
