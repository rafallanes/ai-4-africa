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

type SchoolRow = Tables<"schools">;
type AmbassadorRow = Tables<"ambassadors">;
type ProjectRow = Tables<"projects"> & { schools: SchoolRow | null; ambassadors: AmbassadorRow | null };

const Admin = () => {
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
    else { toast({ title: "School validated" }); load(); }
  };

  const validateAmbassador = async (id: string) => {
    const { error } = await supabase.from("ambassadors").update({ validated: true }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Ambassador validated" }); load(); }
  };

  const updateProjectStatus = async (id: string, status: "buscando" | "apadrinado" | "completado") => {
    const { error } = await supabase.from("projects").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Status updated" }); load(); }
  };

  const deleteSchool = async (id: string) => {
    if (!confirm("Delete this school and its projects?")) return;
    const { error } = await supabase.from("schools").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); load(); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Access denied</CardTitle>
              <CardDescription>Your account doesn't have admin privileges.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Signed in as {user?.email}</p>
              <Button onClick={signOut} variant="outline" className="w-full">Sign out</Button>
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
              <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
            </div>
            <Button onClick={signOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>

          <Tabs defaultValue="schools" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schools">Schools ({schools.length})</TabsTrigger>
              <TabsTrigger value="ambassadors">Ambassadors ({ambassadors.length})</TabsTrigger>
              <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="schools" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>School Applications</CardTitle>
                  <CardDescription>Review and validate school registrations</CardDescription>
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
                            {school.validated ? "Validated" : "Pending"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                          <div><span className="text-muted-foreground">Students:</span> <span className="font-medium">{school.student_count}</span></div>
                          <div><span className="text-muted-foreground">Age:</span> <span className="font-medium">{school.age_range}</span></div>
                          <div><span className="text-muted-foreground">Language:</span> <span className="font-medium">{school.training_language}</span></div>
                          <div><span className="text-muted-foreground">Budget:</span> <span className="font-medium">${school.required_amount}</span></div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Mail className="h-4 w-4" /> {school.contact_email}
                        </div>
                        <div className="flex gap-2">
                          {!school.validated && (
                            <Button size="sm" onClick={() => validateSchool(school.id)}>
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Validate
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => deleteSchool(school.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {schools.length === 0 && <p className="text-sm text-muted-foreground">No schools yet.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ambassadors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ambassador Applications</CardTitle>
                  <CardDescription>Review and validate volunteer ambassadors</CardDescription>
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
                            {amb.validated ? "Validated" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-sm mb-3">{amb.expertise}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Mail className="h-4 w-4" /> {amb.email}
                        </div>
                        <div className="p-3 bg-muted rounded text-sm mb-3">
                          <p className="font-medium mb-1">Motivation:</p>
                          <p className="text-muted-foreground">{amb.motivation}</p>
                        </div>
                        {!amb.validated && (
                          <Button size="sm" onClick={() => validateAmbassador(amb.id)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Validate
                          </Button>
                        )}
                      </div>
                    ))}
                    {ambassadors.length === 0 && <p className="text-sm text-muted-foreground">No ambassadors yet.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Management</CardTitle>
                  <CardDescription>Update project statuses</CardDescription>
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
                            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="buscando">Buscando</SelectItem>
                              <SelectItem value="apadrinado">Apadrinado</SelectItem>
                              <SelectItem value="completado">Completado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {p.ambassadors && (
                          <p className="text-sm"><span className="text-muted-foreground">Ambassador:</span> {p.ambassadors.name}</p>
                        )}
                      </div>
                    ))}
                    {projects.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
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
