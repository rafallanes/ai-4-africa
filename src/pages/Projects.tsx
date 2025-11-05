import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { mockProjects } from "@/data/mockData";
import { MapPin, Users, Calendar, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Projects = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Active Projects</h1>
            <p className="text-lg text-muted-foreground">
              Discover schools seeking AI education and support their journey
            </p>
          </div>

          <div className="space-y-6">
            {mockProjects.map((project) => (
              <Card key={project.id} className="shadow-impact transition-smooth hover:-translate-y-1">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{project.school.name}</CardTitle>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
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
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Training Language</p>
                      <p className="font-medium">{project.school.trainingLanguage}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Age Range</p>
                      <p className="font-medium">{project.school.ageRange} years</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Materials Available</p>
                      <p className="font-medium">{project.school.hasMaterials ? "Yes" : "Need support"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Required Amount
                      </p>
                      <p className="font-medium">${project.school.requiredAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {project.ambassador && (
                    <div className="mt-4 p-4 bg-accent rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Ambassador</p>
                      <p className="font-medium">{project.ambassador.name}</p>
                      {project.ambassador.linkedin && (
                        <a 
                          href={project.ambassador.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View LinkedIn Profile
                        </a>
                      )}
                    </div>
                  )}

                  {project.sponsoringCompany && (
                    <div className="mt-4 p-4 bg-success-light rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Sponsored by</p>
                      <p className="font-medium">{project.sponsoringCompany.name}</p>
                    </div>
                  )}

                  {project.status === "completado" && project.testimonials && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Impact Story</p>
                      <p className="text-sm text-muted-foreground italic">"{project.testimonials}"</p>
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    <Link to={`/proyectos/${project.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </Link>
                    {project.status === "buscando" && (
                      <Link to={`/proyectos/${project.id}`} className="flex-1">
                        <Button className="w-full">Sponsor This Project</Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
