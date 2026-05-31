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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

const SchoolForm = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const materials = String(fd.get("materials") ?? "no");

    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("schools").insert({
      name: String(fd.get("schoolName")),
      city: String(fd.get("city")),
      country: String(fd.get("country")),
      student_count: Number(fd.get("studentCount") ?? 0),
      age_range: String(fd.get("ageRange")),
      training_language: String(fd.get("trainingLanguage") ?? ""),
      has_materials: materials === "yes",
      preferred_dates: String(fd.get("preferredDates") ?? ""),
      required_amount: 0,
      contact_name: String(fd.get("contactName")),
      contact_email: String(fd.get("contactEmail")),
      validated: false,
    });

    setIsSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("school.toast.title"), description: t("school.toast.desc") });
    navigate("/proyectos");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <SEO
        title="Register Your School — AI 4 Africa"
        description="Apply to join AI 4 Africa and bring volunteer-led AI literacy training to your students."
        path="/form/escuela"
      />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <GraduationCap className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("school.title")}</h1>
            <p className="text-muted-foreground">{t("school.subtitle")}</p>
          </div>

          <Card className="shadow-impact">
            <CardHeader>
              <CardTitle>{t("school.cardTitle")}</CardTitle>
              <CardDescription>{t("school.cardDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">{t("school.name")}</Label>
                  <Input id="schoolName" name="schoolName" required placeholder={t("school.namePh")} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t("school.city")}</Label>
                    <Input id="city" name="city" required placeholder={t("school.cityPh")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">{t("school.country")}</Label>
                    <Input id="country" name="country" required placeholder={t("school.countryPh")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentCount">{t("school.studentCount")}</Label>
                    <Input id="studentCount" name="studentCount" type="number" required placeholder={t("school.studentCountPh")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageRange">{t("school.ageRange")}</Label>
                    <Input id="ageRange" name="ageRange" required placeholder={t("school.ageRangePh")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainingLanguage">{t("school.trainingLanguage")}</Label>
                  <Select name="trainingLanguage" required defaultValue="English">
                    <SelectTrigger><SelectValue placeholder={t("school.selectLang")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">{t("school.lang.en")}</SelectItem>
                      <SelectItem value="French">{t("school.lang.fr")}</SelectItem>
                      <SelectItem value="Spanish">{t("school.lang.es")}</SelectItem>
                      <SelectItem value="Portuguese">{t("school.lang.pt")}</SelectItem>
                      <SelectItem value="Swahili">{t("school.lang.sw")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materials">{t("school.materials")}</Label>
                  <Select name="materials" required defaultValue="no">
                    <SelectTrigger><SelectValue placeholder={t("school.selectOpt")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">{t("school.mat.yes")}</SelectItem>
                      <SelectItem value="no">{t("school.mat.no")}</SelectItem>
                      <SelectItem value="partial">{t("school.mat.partial")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredDates">{t("school.preferredDates")}</Label>
                  <Input id="preferredDates" name="preferredDates" required placeholder={t("school.preferredDatesPh")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName">{t("school.contactName")}</Label>
                  <Input id="contactName" name="contactName" required placeholder={t("school.contactNamePh")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">{t("school.contactEmail")}</Label>
                  <Input id="contactEmail" name="contactEmail" type="email" required placeholder={t("school.contactEmailPh")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">{t("school.contactPhone")}</Label>
                  <Input id="contactPhone" name="contactPhone" type="tel" placeholder={t("school.contactPhonePh")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">{t("school.additional")}</Label>
                  <Textarea id="additionalInfo" name="additionalInfo" placeholder={t("school.additionalPh")} rows={4} />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("school.submitting") : t("school.submit")}
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

export default SchoolForm;
