import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { GraduationCap, Heart, Users, Target, Building2 } from "lucide-react";
import heroImage from "@/assets/hero-classroom.jpg";
import { useT } from "@/i18n/LanguageProvider";

const Index = () => {
  const { t, lang } = useT();
  const fmt = new Intl.NumberFormat(lang === "en" ? "en-US" : lang === "fr" ? "fr-FR" : "es-ES");
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Oportunia — AI Education for Every Child at Risk"
        description="Connecting schools, volunteer ambassadors, and companies to bring hands-on AI education to children facing social exclusion — in Spain, Africa and beyond."
        path="/"
      />
      <Navigation />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.95)), url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{t("index.hero.title")}</h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">{t("index.hero.subtitle")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/form/escuela">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    {t("index.hero.ctaSchool")}
                  </Button>
                </Link>
                <Link to="/form/embajador">
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20 backdrop-blur-sm">
                    <Users className="mr-2 h-5 w-5" />
                    {t("index.hero.ctaAmbassador")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("index.roles.title")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { to: "/form/escuela", icon: GraduationCap, name: t("index.roles.school.name"), desc: t("index.roles.school.desc"), cta: t("index.roles.school.cta") },
                { to: "/form/embajador", icon: Users, name: t("index.roles.ambassador.name"), desc: t("index.roles.ambassador.desc"), cta: t("index.roles.ambassador.cta") },
                { to: "/proyectos", icon: Building2, name: t("index.roles.company.name"), desc: t("index.roles.company.desc"), cta: t("index.roles.company.cta") },
              ].map(({ to, icon: Icon, name, desc, cta }) => (
                <Link key={to} to={to} className="group block">
                  <Card className="h-full shadow-impact transition-all hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="pt-8 pb-8 text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{name}</h3>
                      <p className="text-muted-foreground mb-6">{desc}</p>
                      <Button className="shadow-sm">{cta}</Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-accent">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">{fmt.format(20)}+</div>
                <div className="text-muted-foreground">{t("index.stats.schools")}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">{fmt.format(5)}+</div>
                <div className="text-muted-foreground">{t("index.stats.ambassadors")}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">{fmt.format(1200)}+</div>
                <div className="text-muted-foreground">{t("index.stats.students")}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("index.how.title")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: GraduationCap, title: t("index.how.s1.title"), body: t("index.how.s1.body") },
                { icon: Users, title: t("index.how.s2.title"), body: t("index.how.s2.body") },
                { icon: Heart, title: t("index.how.s3.title"), body: t("index.how.s3.body") },
              ].map(({ icon: Icon, title, body }) => (
                <Card key={title} className="shadow-impact transition-smooth hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <p className="text-muted-foreground">{body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("index.impact.title")}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t("index.impact.body")}</p>
              <Link to="/proyectos">
                <Button size="lg" className="shadow-lg">{t("index.impact.cta")}</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
