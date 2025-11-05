import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GraduationCap, Heart, Users, Target } from "lucide-react";
import heroImage from "@/assets/hero-classroom.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.95)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Empowering African Education with AI
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Connecting schools, volunteer ambassadors, and companies to bring AI education to every African classroom
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/form/escuela">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Register Your School
                </Button>
              </Link>
              <Link to="/form/embajador">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20 backdrop-blur-sm">
                  <Users className="mr-2 h-5 w-5" />
                  Become an Ambassador
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Schools Registered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">85+</div>
              <div className="text-muted-foreground">Active Ambassadors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">12K+</div>
              <div className="text-muted-foreground">Students Impacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-impact transition-smooth hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Schools Register</h3>
                <p className="text-muted-foreground">
                  African schools share their needs, student count, and preferred training dates to join our platform.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-impact transition-smooth hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Ambassadors Apply</h3>
                <p className="text-muted-foreground">
                  Validated volunteers review schools and apply to deliver AI training programs.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-impact transition-smooth hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Companies Sponsor</h3>
                <p className="text-muted-foreground">
                  Organizations fund projects, enabling ambassadors to deliver impactful AI education.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Every project brings AI literacy to students who need it most, preparing them for tomorrow's opportunities.
            </p>
            <Link to="/proyectos">
              <Button size="lg" className="shadow-lg">
                View Active Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
