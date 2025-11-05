import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Rocket, Search } from "lucide-react";

type ProjectStatus = "buscando" | "apadrinado" | "completado";

interface StatusBadgeProps {
  status: ProjectStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    buscando: {
      label: "🔍 Buscando patrocinio",
      variant: "warning" as const,
      icon: Search,
    },
    apadrinado: {
      label: "🌱 Listo para despegar",
      variant: "default" as const,
      icon: Rocket,
    },
    completado: {
      label: "🎯 Impacto cumplido",
      variant: "success" as const,
      icon: CheckCircle2,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1.5">
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
};
