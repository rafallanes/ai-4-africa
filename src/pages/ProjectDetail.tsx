import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { MapPin, Users, Calendar, DollarSign, Building2 } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

type Row = Tables<"projects"> & {
  schools: Tables<"schools"> | null;
  ambassadors: Tables<"ambassadors"> | null;
  companies: Tables<"companies"> | null;
};

const ProjectDetail = () => {
  const { t } = useT();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("projects")
      .select("*, schools(id,name,city,country,student_count,age_range,training_language,has_materials,preferred_dates,required_amount,validated,created_at,updated_at), ambassadors(id,name,country,expertise,motivation,languages,availability,validated,created_at,updated_at), companies:sponsoring_company_id(id,name,logo_url,commitment,created_at,updated_at)")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setProject(data as Row | null);
        setLoading(false);
      });
  }, [id]);

  const handleSponsorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    toast({ title: t("detail.toast.title"), description: t("detail.toast.desc") });
    setIsSubmitting(false);
    setShowSponsorForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">{t("projects.loading")}</main>
        <Footer />
      </div>
    );
  }

  if (!project || !project.schools) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t("detail.notFound")}</h1>
            <Button onClick={() => navigate("/proyectos")}>{t("detail.backBtn")}</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const school = project.schools;
  const seoTitle = `${school.name} — AI Education Project | AI 4 Africa`;
  const seoDescription = `Support ${school.name} in ${school.city}, ${school.country}: AI training for ${school.student_count} students. Status: ${project.status}.`;
  const amount = Number(school.required_amount).toLocaleString();

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={seoTitle.slice(0, 60)}
        description={seoDescription.slice(0, 160)}
        path={`/proyectos/${project.id}`}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `AI Education Project at ${school.name}`,
          description: seoDescription,
          about: { "@type": "EducationalOrganization", name: school.name, address: `${school.city}, ${school.country}` },
          publisher: { "@type": "Organization", name: "AI 4 Africa" },
        }}
      />
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={() => navigate("/proyectos")} className="mb-6">
            {t("detail.back")}
          </Button>

          <Card className="shadow-impact mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-semibold leading-none tracking-tight mb-3">{school.name}</h1>
                  <div className="flex flex-wrap gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{school.city}, {school.country}</div>
                    <div className="flex items-center gap-1"><Users className="h-4 w-4" />{school.student_count} {t("projects.students")}</div>
                    <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{school.preferred_dates}</div>
                  </div>
                </div>
                <StatusBadge status={project.status} />
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-3">{t("detail.schoolDetails")}</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">{t("detail.trainingLanguage")}</span><span className="font-medium">{school.training_language}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">{t("detail.ageRange")}</span><span className="font-medium">{school.age_range} {t("projects.years")}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">{t("detail.materials")}</span><span className="font-medium">{school.has_materials ? t("detail.available") : t("detail.needSupport")}</span></div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">{t("detail.requiredFunding")}</h2>
                  </div>
                  <p className="text-3xl font-bold text-primary">${amount}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("detail.fundingDesc")}</p>
                </div>
              </div>

              {project.ambassadors && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">{t("detail.ambassador")}</h2>
                  <div className="p-4 bg-accent rounded-lg">
                    <p className="font-medium mb-1">{project.ambassadors.name}</p>
                    <p className="text-sm text-muted-foreground mb-2">{project.ambassadors.country}</p>
                    <p className="text-sm mb-3">{project.ambassadors.expertise}</p>
                  </div>
                </div>
              )}

              {project.companies && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">{t("detail.sponsoredBy")}</h2>
                  <div className="p-4 bg-success-light rounded-lg flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-success" />
                    <div>
                      <p className="font-medium">{project.companies.name}</p>
                      <p className="text-sm text-muted-foreground">{t("detail.sponsoredTag")}</p>
                    </div>
                  </div>
                </div>
              )}

              {project.status === "completado" && project.testimonials && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">{t("detail.impactStory")}</h2>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-muted-foreground italic">"{project.testimonials}"</p>
                    {project.final_student_count && (
                      <p className="text-sm mt-3 font-medium">{t("detail.finalStudents")} {project.final_student_count} {t("detail.studentsTrained")}</p>
                    )}
                  </div>
                </div>
              )}

              {project.status === "buscando" && !showSponsorForm && (
                <Button onClick={() => setShowSponsorForm(true)} size="lg" className="w-full">
                  {t("detail.sponsorBtn")}
                </Button>
              )}
            </CardContent>
          </Card>

          {showSponsorForm && project.status === "buscando" && (
            <Card className="shadow-impact">
              <CardHeader>
                <CardTitle>{t("detail.sponsorTitle")}</CardTitle>
                <CardDescription>{t("detail.sponsorDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSponsorSubmit} className="space-y-6">
                  <div className="space-y-2"><Label htmlFor="companyName">{t("detail.companyName")}</Label><Input id="companyName" required placeholder={t("detail.companyNamePh")} /></div>
                  <div className="space-y-2"><Label htmlFor="contactName">{t("detail.contactPerson")}</Label><Input id="contactName" required placeholder={t("detail.fullName")} /></div>
                  <div className="space-y-2"><Label htmlFor="contactEmail">{t("detail.contactEmail")}</Label><Input id="contactEmail" type="email" required placeholder={t("detail.contactEmailPh")} /></div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <Checkbox id="commitment" required />
                    <label htmlFor="commitment" className="text-sm font-medium leading-none">
                      {t("detail.commitment", { amount })}
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowSponsorForm(false)} className="flex-1">{t("detail.cancel")}</Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? t("detail.submitting") : t("detail.confirm")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
