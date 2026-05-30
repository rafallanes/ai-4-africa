import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";

const AmbassadorForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Application Submitted!",
      description: "Thank you for applying! We'll review your profile and contact you within 48 hours.",
    });

    setIsSubmitting(false);
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Become an Ambassador</h1>
            <p className="text-muted-foreground">
              Share your AI expertise and make a lasting impact in Africa
            </p>
          </div>

          <Card className="shadow-impact">
            <CardHeader>
              <CardTitle>Ambassador Application</CardTitle>
              <CardDescription>
                Tell us about yourself and why you want to volunteer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" required placeholder="Your full name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country of Residence *</Label>
                  <Input id="country" required placeholder="Where are you based?" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" required placeholder="your.email@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                  <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/yourprofile" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvUrl">CV/Resume URL *</Label>
                  <Input 
                    id="cvUrl" 
                    type="url" 
                    required 
                    placeholder="Link to your CV (Google Drive, Dropbox, etc.)" 
                  />
                  <p className="text-xs text-muted-foreground">
                    Please share a link to your CV stored in Google Drive, Dropbox, or similar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">Your AI/Tech Expertise *</Label>
                  <Textarea 
                    id="expertise" 
                    required
                    placeholder="Briefly describe your background in AI, machine learning, or technology..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">Why do you want to be an ambassador? *</Label>
                  <Textarea 
                    id="motivation" 
                    required
                    placeholder="Share your motivation for bringing AI education to Africa..."
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability *</Label>
                  <Textarea 
                    id="availability" 
                    required
                    placeholder="When are you available? How much time can you commit? (e.g., 2 weeks in March 2025)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages">Languages You Speak *</Label>
                  <Input 
                    id="languages" 
                    required 
                    placeholder="e.g., English, French, Swahili" 
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

export default AmbassadorForm;
