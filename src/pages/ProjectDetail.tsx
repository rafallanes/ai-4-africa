import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/StatusBadge";
import { mockProjects } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Users, Calendar, DollarSign, Building2 } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <Button onClick={() => navigate("/proyectos")}>Back to Projects</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSponsorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Sponsorship Request Submitted!",
      description: "Thank you for your commitment! We'll contact you within 24 hours to finalize the sponsorship.",
    });

    setIsSubmitting(false);
    setShowSponsorForm(false);
    navigate("/proyectos");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={() => navigate("/proyectos")} className="mb-6">
            ← Back to Projects
          </Button>

          <Card className="shadow-impact mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-3">{project.school.name}</CardTitle>
                  <div className="flex flex-wrap gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {project.school.city}, {project.school.country}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {project.school.studentCount} students
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {project.school.preferredDates}
                    </div>
                  </div>
                </div>
                <StatusBadge status={project.status} />
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">School Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Training Language:</span>
                      <span className="font-medium">{project.school.trainingLanguage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age Range:</span>
                      <span className="font-medium">{project.school.ageRange} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Materials:</span>
                      <span className="font-medium">{project.school.hasMaterials ? "Available" : "Need support"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Required Funding</h3>
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    ${project.school.requiredAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Covers training materials, devices, and ambassador travel
                  </p>
                </div>
              </div>

              {project.ambassador && (
                <div>
                  <h3 className="font-semibold mb-3">Ambassador</h3>
                  <div className="p-4 bg-accent rounded-lg">
                    <p className="font-medium mb-1">{project.ambassador.name}</p>
                    <p className="text-sm text-muted-foreground mb-2">{project.ambassador.country}</p>
                    <p className="text-sm mb-3">{project.ambassador.expertise}</p>
                    {project.ambassador.linkedin && (
                      <a 
                        href={project.ambassador.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View LinkedIn Profile →
                      </a>
                    )}
                  </div>
                </div>
              )}

              {project.sponsoringCompany && (
                <div>
                  <h3 className="font-semibold mb-3">Sponsored By</h3>
                  <div className="p-4 bg-success-light rounded-lg flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-success" />
                    <div>
                      <p className="font-medium">{project.sponsoringCompany.name}</p>
                      <p className="text-sm text-muted-foreground">Making AI education accessible</p>
                    </div>
                  </div>
                </div>
              )}

              {project.status === "completado" && (
                <>
                  {project.testimonials && (
                    <div>
                      <h3 className="font-semibold mb-3">Impact Story</h3>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-muted-foreground italic">"{project.testimonials}"</p>
                        {project.finalStudentCount && (
                          <p className="text-sm mt-3 font-medium">
                            Final Student Count: {project.finalStudentCount} students trained
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {project.comments && (
                    <div>
                      <h3 className="font-semibold mb-3">School Feedback</h3>
                      <div className="p-4 bg-accent rounded-lg">
                        <p className="text-sm">{project.comments}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {project.status === "buscando" && !showSponsorForm && (
                <Button onClick={() => setShowSponsorForm(true)} size="lg" className="w-full">
                  Sponsor This Project
                </Button>
              )}
            </CardContent>
          </Card>

          {showSponsorForm && project.status === "buscando" && (
            <Card className="shadow-impact">
              <CardHeader>
                <CardTitle>Company Sponsorship Form</CardTitle>
                <CardDescription>
                  Commit to funding this educational project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSponsorSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input id="companyName" required placeholder="Your company name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Person *</Label>
                    <Input id="contactName" required placeholder="Full name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input id="contactEmail" type="email" required placeholder="company@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Company Logo URL (optional)</Label>
                    <Input id="logoUrl" type="url" placeholder="https://yourcompany.com/logo.png" />
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <Checkbox id="commitment" required />
                    <label
                      htmlFor="commitment"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I commit to funding ${project.school.requiredAmount.toLocaleString()} for this educational project *
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowSponsorForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? "Submitting..." : "Confirm Sponsorship"}
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
