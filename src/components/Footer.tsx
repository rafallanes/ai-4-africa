import { GraduationCap, Heart } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

export const Footer = () => {
  const { t } = useT();
  return (
    <footer className="border-t bg-muted/50 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold text-gradient">Oportunia</span>
          </div>

          <p className="text-sm text-muted-foreground flex items-center gap-2">
            {t("footer.tagline")} <Heart className="h-4 w-4 text-destructive fill-destructive" /> {t("footer.taglineEnd")}
          </p>

          <p className="text-sm text-muted-foreground">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
};
