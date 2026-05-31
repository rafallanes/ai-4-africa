import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Rocket, Search } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

type ProjectStatus = "buscando" | "apadrinado" | "completado";

interface StatusBadgeProps {
  status: ProjectStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useT();
  const cfg = {
    buscando: { variant: "warning" as const, icon: Search },
    apadrinado: { variant: "default" as const, icon: Rocket },
    completado: { variant: "success" as const, icon: CheckCircle2 },
  }[status];
  const Icon = cfg.icon;
  return (
    <Badge variant={cfg.variant} className="gap-1.5">
      <Icon className="h-3.5 w-3.5" />
      {t(`status.${status}`)}
    </Badge>
  );
};
