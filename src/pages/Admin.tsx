import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Mail, Shield, LogOut, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import { useT } from "@/i18n/LanguageProvider";

type SchoolRow = Tables<"schools">;
type AmbassadorRow = Tables<"ambassadors">;
type ProjectRow = Tables<"projects"> & { schools: SchoolRow | null; ambassadors: AmbassadorRow | null };

const Admin = () => {
  const { t } = useT();
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [ambassadors, setAmbassadors] = useState<AmbassadorRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const load = async () => {
    const [s, a, p] = await Promise.all([
      supabase.from("schools").select("*").order("created_at", { ascending: false }),
      supabase.from("ambassadors").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*, schools(*), ambassadors(*)").order("created_at", { ascending: false }),
    ]);
    if (s.data) setSchools(s.data);
    if (a.data) setAmbassadors(a.data);
    if (p.data) setProjects(p.data as ProjectRow[]);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const validateSchool = async (id: string) => {
    const { error } = await supabase.from("schools").update({ validated: true }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: t("admin.schoolValidated") }); load(); }
  };

  const validateAmbassador = async (id: string) => {
    const { error } = await supabase.from("ambassadors").update({ validated: true }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: t("admin.ambValidated") }); load(); }
  };

  const updateProjectStatus = async (id: string, status: "buscando" | "apadrinado" | "completado") => {
    const { error } = await supabase.from("projects").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: t("admin.statusUpdated") }); load(); }
  };

  const deleteSchool = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    const { error } = await supabase.from("schools").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: t("admin.deleted") }); load(); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">{t("admin.loading")}</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>{t("admin.deniedTitle")}</CardTitle>
              <CardDescription>{t("admin.deniedDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{t("admin.signedInAs")} {user?.email}</p>
              <Button onClick={signOut} variant="outline" className="w-full">{t("admin.signOut")}</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">{t("admin.dashboard")}</h1>
            </div>
            <Button onClick={signOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" /> {t("admin.signOut")}
            </Button>
          </div>

          <Tabs defaultValue="schools" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schools">{t("admin.tab.schools")} ({schools.length})</TabsTrigger>
              <TabsTrigger value="ambassadors">{t("admin.tab.ambassadors")} ({ambassadors.length})</TabsTrigger>
              <TabsTrigger value="projects">{t("admin.tab.projects")} ({projects.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="schools" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.schoolApps")}</CardTitle>
                  <CardDescription>{t("admin.schoolAppsDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {schools.map((school) => (
                      <div key={school.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{school.name}</h3>
                            <p className="text-sm text-muted-foreground">{school.city}, {school.country}</p>
                          </div>
                          <Badge variant={school.validated ? "success" : "warning"}>
                            {school.validated ? t("admin.validated") : t("admin.pending")}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                          <div><span className="text-muted-foreground">{t("admin.students")}</span> <span className="font-medium">{school.student_count}</span></div>
                          <div><span className="text-muted-foreground">{t("admin.age")}</span> <span className="font-medium">{school.age_range}</span></div>
                          <div><span className="text-muted-foreground">{t("admin.language")}</span> <span className="font-medium">{school.training_language}</span></div>
                          <div><span className="text-muted-foreground">{t("admin.budget")}</span> <span className="font-medium">${school.required_amount}</span></div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Mail className="h-4 w-4" /> {school.contact_email}
                        </div>
                        <div className="flex gap-2">
                          {!school.validated && (
                            <Button size="sm" onClick={() => validateSchool(school.id)}>
                              <CheckCircle2 className="mr-2 h-4 w-4" /> {t("admin.validate")}
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => deleteSchool(school.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {schools.length === 0 && <p className="text-sm text-muted-foreground">{t("admin.noSchools")}</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ambassadors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.ambApps")}</CardTitle>
                  <CardDescription>{t("admin.ambAppsDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ambassadors.map((amb) => (
                      <div key={amb.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{amb.name}</h3>
                            <p className="text-sm text-muted-foreground">{amb.country}</p>
                          </div>
                          <Badge variant={amb.validated ? "success" : "warning"}>
                            {amb.validated ? t("admin.validated") : t("admin.pending")}
                          </Badge>
                        </div>
                        <p className="text-sm mb-3">{amb.expertise}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Mail className="h-4 w-4" /> {amb.email}
                        </div>
                        <div className="p-3 bg-muted rounded text-sm mb-3">
                          <p className="font-medium mb-1">{t("admin.motivation")}</p>
                          <p className="text-muted-foreground">{amb.motivation}</p>
                        </div>
                        {!amb.validated && (
                          <Button size="sm" onClick={() => validateAmbassador(amb.id)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> {t("admin.validate")}
                          </Button>
                        )}
                      </div>
                    ))}
                    {ambassadors.length === 0 && <p className="text-sm text-muted-foreground">{t("admin.noAmbs")}</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.projMgmt")}</CardTitle>
                  <CardDescription>{t("admin.projMgmtDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((p) => (
                      <div key={p.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{p.schools?.name ?? "—"}</h3>
                            <p className="text-sm text-muted-foreground">
                              {p.schools?.city}, {p.schools?.country}
                            </p>
                          </div>
                          <Select value={p.status} onValueChange={(v) => updateProjectStatus(p.id, v as any)}>
                            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="buscando">{t("admin.status.buscando")}</SelectItem>
                              <SelectItem value="apadrinado">{t("admin.status.apadrinado")}</SelectItem>
                              <SelectItem value="completado">{t("admin.status.completado")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {p.ambassadors && (
                          <p className="text-sm"><span className="text-muted-foreground">{t("projects.ambassador")}:</span> {p.ambassadors.name}</p>
                        )}
                      </div>
                    ))}
                    {projects.length === 0 && <p className="text-sm text-muted-foreground">{t("admin.noProjects")}</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
