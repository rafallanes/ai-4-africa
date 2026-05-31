import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

const AmbassadorForm = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("ambassadors").insert({
      name: String(fd.get("fullName")),
      country: String(fd.get("country")),
      email: String(fd.get("email")),
      linkedin: String(fd.get("linkedin") ?? "") || null,
      cv_url: String(fd.get("cvUrl") ?? "") || null,
      expertise: String(fd.get("expertise")),
      motivation: String(fd.get("motivation")),
      availability: String(fd.get("availability") ?? "") || null,
      languages: String(fd.get("languages") ?? "") || null,
      validated: false,
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("amb.toast.title"), description: t("amb.toast.desc") });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <SEO
        title="Become an AI Ambassador — AI 4 Africa"
        description="Volunteer your AI expertise to train students at schools across Africa. Apply to join our ambassador network."
        path="/form/embajador"
      />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Users className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("amb.title")}</h1>
            <p className="text-muted-foreground">{t("amb.subtitle")}</p>
          </div>

          <Card className="shadow-impact">
            <CardHeader>
              <CardTitle>{t("amb.cardTitle")}</CardTitle>
              <CardDescription>{t("amb.cardDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("amb.fullName")}</Label>
                  <Input id="fullName" name="fullName" required placeholder={t("amb.fullNamePh")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">{t("amb.country")}</Label>
                  <Input id="country" name="country" required placeholder={t("amb.countryPh")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("amb.email")}</Label>
                  <Input id="email" name="email" type="email" required placeholder={t("amb.emailPh")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">{t("amb.linkedin")}</Label>
                  <Input id="linkedin" name="linkedin" type="url" placeholder={t("amb.linkedinPh")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvUrl">{t("amb.cv")}</Label>
                  <Input id="cvUrl" name="cvUrl" type="url" required placeholder={t("amb.cvPh")} />
                  <p className="text-xs text-muted-foreground">{t("amb.cvHint")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">{t("amb.expertise")}</Label>
                  <Textarea id="expertise" name="expertise" required placeholder={t("amb.expertisePh")} rows={4} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">{t("amb.motivation")}</Label>
                  <Textarea id="motivation" name="motivation" required placeholder={t("amb.motivationPh")} rows={6} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">{t("amb.availability")}</Label>
                  <Textarea id="availability" name="availability" required placeholder={t("amb.availabilityPh")} rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages">{t("amb.languages")}</Label>
                  <Input id="languages" name="languages" required placeholder={t("amb.languagesPh")} />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("amb.submitting") : t("amb.submit")}
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

export default AmbassadorForm;
