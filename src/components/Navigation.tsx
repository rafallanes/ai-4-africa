import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/i18n/LanguageProvider";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useT();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gradient">AI 4 Africa</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/proyectos" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
              {t("nav.projects")}
            </Link>
            <Link to="/form/escuela" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
              {t("nav.registerSchool")}
            </Link>
            <Link to="/form/embajador" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
              {t("nav.becomeAmbassador")}
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="sm">{t("nav.admin")}</Button>
            </Link>
            <LanguageSwitcher />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={t("nav.toggleMenu")}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <Link to="/proyectos" className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-smooth" onClick={() => setIsMenuOpen(false)}>
              {t("nav.projects")}
            </Link>
            <Link to="/form/escuela" className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-smooth" onClick={() => setIsMenuOpen(false)}>
              {t("nav.registerSchool")}
            </Link>
            <Link to="/form/embajador" className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-smooth" onClick={() => setIsMenuOpen(false)}>
              {t("nav.becomeAmbassador")}
            </Link>
            <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">{t("nav.admin")}</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
