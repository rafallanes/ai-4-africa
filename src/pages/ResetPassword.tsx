import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/i18n/LanguageProvider";

const ResetPassword = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password"));
    const confirm = String(fd.get("confirm"));
    if (password !== confirm) {
      toast({ title: t("reset.mismatch"), variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("reset.updated") });
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="Reset password — AI 4 Africa" description="Set a new password" path="/reset-password" />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{t("reset.title")}</CardTitle>
              <CardDescription>{t("reset.desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{t("reset.new")}</Label>
                  <Input id="password" name="password" type="password" required minLength={8} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">{t("reset.confirm")}</Label>
                  <Input id="confirm" name="confirm" type="password" required minLength={8} />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? t("reset.updating") : t("reset.update")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
