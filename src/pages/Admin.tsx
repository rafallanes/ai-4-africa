import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProjects, mockAmbassadors, mockSchools } from "@/data/mockData";
import { CheckCircle2, Clock, Mail, Shield } from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
          </div>

          <Tabs defaultValue="schools" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schools">Schools</TabsTrigger>
              <TabsTrigger value="ambassadors">Ambassadors</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="schools" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>School Applications</CardTitle>
                  <CardDescription>Review and validate school registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSchools.map((school) => (
                      <div key={school.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{school.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {school.city}, {school.country}
                            </p>
                          </div>
                          <Badge variant={school.validated ? "success" : "warning"}>
                            {school.validated ? "Validated" : "Pending"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Students:</span>
                            <span className="ml-1 font-medium">{school.studentCount}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Age:</span>
                            <span className="ml-1 font-medium">{school.ageRange}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Language:</span>
                            <span className="ml-1 font-medium">{school.trainingLanguage}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Budget:</span>
                            <span className="ml-1 font-medium">${school.requiredAmount}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Mail className="h-4 w-4" />
                          <span>{school.contactEmail}</span>
                        </div>
                        {!school.validated && (
                          <Button size="sm" className="w-full md:w-auto">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Validate School
                          </Button>
                        )}
                      </div>
                    ))}
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
                    {mockAmbassadors.map((ambassador) => (
                      <div key={ambassador.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{ambassador.name}</h3>
                            <p className="text-sm text-muted-foreground">{ambassador.country}</p>
                          </div>
                          <Badge variant={ambassador.validated ? "success" : "warning"}>
                            {ambassador.validated ? "Validated" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-sm mb-3">{ambassador.expertise}</p>
                        <div className="space-y-2 text-sm mb-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{ambassador.email}</span>
                          </div>
                          {ambassador.linkedin && (
                            <a 
                              href={ambassador.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-block"
                            >
                              View LinkedIn Profile →
                            </a>
                          )}
                        </div>
                        <div className="p-3 bg-muted rounded text-sm mb-3">
                          <p className="font-medium mb-1">Motivation:</p>
                          <p className="text-muted-foreground">{ambassador.motivation}</p>
                        </div>
                        {!ambassador.validated && (
                          <Button size="sm" className="w-full md:w-auto">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Validate Ambassador
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Management</CardTitle>
                  <CardDescription>Monitor and update project statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProjects.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{project.school.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {project.school.city}, {project.school.country}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              project.status === "completado" ? "success" : 
                              project.status === "apadrinado" ? "default" : 
                              "warning"
                            }
                          >
                            {project.status === "buscando" && <Clock className="h-3 w-3 mr-1" />}
                            {project.status === "completado" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                            {project.status}
                          </Badge>
                        </div>
                        
                        {project.ambassador && (
                          <div className="p-3 bg-accent rounded text-sm mb-3">
                            <p className="font-medium">Ambassador: {project.ambassador.name}</p>
                          </div>
                        )}
                        
                        {project.sponsoringCompany && (
                          <div className="p-3 bg-success-light rounded text-sm mb-3">
                            <p className="font-medium">Sponsor: {project.sponsoringCompany.name}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {project.status === "buscando" && (
                            <Button size="sm" variant="outline">
                              Match Ambassador
                            </Button>
                          )}
                          {project.status === "apadrinado" && (
                            <Button size="sm" variant="outline">
                              Mark as Completed
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            Edit Details
                          </Button>
                        </div>
                      </div>
                    ))}
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
