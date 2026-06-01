import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { MapPin, Users, Calendar, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useT } from "@/i18n/LanguageProvider";

type Row = Tables<"projects"> & {
  schools: Tables<"schools"> | null;
  ambassadors: Tables<"ambassadors"> | null;
  companies: Tables<"companies"> | null;
};

const Projects = () => {
  const { t } = useT();
  const [projects, setProjects] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*, schools(id,name,city,country,student_count,age_range,training_language,has_materials,preferred_dates,required_amount,validated,created_at,updated_at), ambassadors(id,name,country,expertise,motivation,languages,availability,validated,created_at,updated_at), companies:sponsoring_company_id(id,name,logo_url,commitment,created_at,updated_at)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setProjects(data as any);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Active AI Education Projects — AI 4 Africa"
        description="Browse African schools currently seeking volunteer ambassadors and corporate sponsors for AI training programs."
        path="/proyectos"
      />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("projects.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("projects.subtitle")}</p>
          </div>

          {loading && <p className="text-center text-muted-foreground">{t("projects.loading")}</p>}

          <div className="space-y-6">
            {projects.map((project) => {
              const school = project.schools;
              if (!school) return null;
              return (
                <Card key={project.id} className="shadow-impact transition-smooth hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{school.name}</CardTitle>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{school.city}, {school.country}</div>
                          <div className="flex items-center gap-1"><Users className="h-4 w-4" />{school.student_count} {t("projects.students")}</div>
                          <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{school.preferred_dates}</div>
                        </div>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div><p className="text-sm font-medium text-muted-foreground mb-1">{t("projects.trainingLanguage")}</p><p className="font-medium">{school.training_language}</p></div>
                      <div><p className="text-sm font-medium text-muted-foreground mb-1">{t("projects.ageRange")}</p><p className="font-medium">{school.age_range} {t("projects.years")}</p></div>
                      <div><p className="text-sm font-medium text-muted-foreground mb-1">{t("projects.materials")}</p><p className="font-medium">{school.has_materials ? t("projects.yes") : t("projects.needSupport")}</p></div>
                      <div><p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1"><DollarSign className="h-4 w-4" />{t("projects.requiredAmount")}</p><p className="font-medium">${Number(school.required_amount).toLocaleString()}</p></div>
                    </div>

                    {project.ambassadors && (
                      <div className="mt-4 p-4 bg-accent rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{t("projects.ambassador")}</p>
                        <p className="font-medium">{project.ambassadors.name}</p>
                      </div>
                    )}

                    {project.companies && (
                      <div className="mt-4 p-4 bg-success-light rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{t("projects.sponsoredBy")}</p>
                        <p className="font-medium">{project.companies.name}</p>
                      </div>
                    )}

                    {project.status === "completado" && project.testimonials && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">{t("projects.impactStory")}</p>
                        <p className="text-sm text-muted-foreground italic">"{project.testimonials}"</p>
                      </div>
                    )}

                    <div className="mt-6 flex gap-3">
                      <Link to={`/proyectos/${project.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">{t("projects.viewDetails")}</Button>
                      </Link>
                      {project.status === "buscando" && (
                        <Link to={`/proyectos/${project.id}`} className="flex-1">
                          <Button className="w-full">{t("projects.sponsorThis")}</Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {!loading && projects.length === 0 && (
              <p className="text-center text-muted-foreground">{t("projects.empty")}</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
