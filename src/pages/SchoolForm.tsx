import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";

const SchoolForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call - In production, this would connect to Airtable
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Application Submitted!",
      description: "Your school has been registered. We'll review your application and contact you soon.",
    });

    setIsSubmitting(false);
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Register Your School</h1>
            <p className="text-muted-foreground">
              Join our network and bring AI education to your students
            </p>
          </div>

          <Card className="shadow-impact">
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>
                Please provide details about your school and training needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input id="schoolName" required placeholder="Enter school name" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" required placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" required placeholder="Country" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentCount">Number of Students *</Label>
                    <Input id="studentCount" type="number" required placeholder="e.g., 250" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageRange">Student Age Range *</Label>
                    <Input id="ageRange" required placeholder="e.g., 12-16" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainingLanguage">Training Language *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="portuguese">Portuguese</SelectItem>
                      <SelectItem value="swahili">Swahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materials">Do you have computers/tablets? *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, we have devices</SelectItem>
                      <SelectItem value="no">No, we need support</SelectItem>
                      <SelectItem value="partial">Some, but need more</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredDates">Preferred Training Dates *</Label>
                  <Input id="preferredDates" required placeholder="e.g., January 2025" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person *</Label>
                  <Input id="contactName" required placeholder="Full name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input id="contactEmail" type="email" required placeholder="email@school.edu" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input id="contactPhone" type="tel" placeholder="+123 456 7890" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea 
                    id="additionalInfo" 
                    placeholder="Tell us more about your needs, challenges, or expectations..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
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
