import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface INECBadgeProps {
  nivel: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
}

const sizeStyles = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-3 py-1.5',
};

// Descrições dos níveis INEC conforme Nota Técnica MEC nº 182/2025
const inecDescriptions: Record<number, { title: string; energy: string; internet: string; wifi: string; status: string }> = {
  0: {
    title: "Nível 0 — Sem Conectividade",
    energy: "❌ Sem energia adequada OU sem internet",
    internet: "❌ Escola não possui conexão à internet",
    wifi: "—",
    status: "🔴 Escola necessita de intervenção urgente em infraestrutura básica"
  },
  1: {
    title: "Nível 1 — Conectividade Crítica",
    energy: "✅ Energia adequada (rede pública ou renovável)",
    internet: "❌ Velocidade inadequada ou não monitorada",
    wifi: "❌ Sem rede Wi-Fi",
    status: "🔴 Necessita contratação de internet adequada e instalação de Wi-Fi"
  },
  2: {
    title: "Nível 2 — Conectividade Insuficiente",
    energy: "✅ Energia adequada",
    internet: "❌ Velocidade inadequada ou não monitorada",
    wifi: "⚠️ Possui Wi-Fi, mas insuficiente",
    status: "🔴 Necessita upgrade de velocidade e expansão da rede Wi-Fi"
  },
  3: {
    title: "Nível 3 — Conectividade Parcial",
    energy: "✅ Energia adequada",
    internet: "✅ Velocidade adequada (≥1 Mbps/aluno, mín. 50 Mbps)",
    wifi: "❌ Sem rede Wi-Fi",
    status: "🟡 Necessita instalação de Access Points para cobertura Wi-Fi"
  },
  4: {
    title: "Nível 4 — Conectividade Adequada",
    energy: "✅ Energia adequada",
    internet: "✅ Velocidade adequada",
    wifi: "⚠️ Wi-Fi insuficiente (<1 AP a cada 2 ambientes)",
    status: "🟢 Parâmetros adequados para uso pedagógico — necessita expansão do Wi-Fi"
  },
  5: {
    title: "Nível 5 — Conectividade Excelente",
    energy: "✅ Energia adequada",
    internet: "✅ Velocidade adequada",
    wifi: "✅ Wi-Fi adequado (≥1 AP a cada 2 ambientes)",
    status: "🟢 Escola plenamente conectada para fins educacionais"
  }
};

// Badge interno com forwardRef para suportar Tooltip
const BadgeSpan = forwardRef<HTMLSpanElement, { nivel: number; displayLabel: string; showLabel: boolean; size: 'sm' | 'md' | 'lg'; getColorClass: () => string; getIcon: () => string }>(
  ({ nivel, displayLabel, showLabel, size, getColorClass, getIcon, ...props }, ref) => (
    <span 
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap cursor-help",
        getColorClass(),
        sizeStyles[size]
      )}
      {...props}
    >
      <span className="text-xs" role="img" aria-hidden>{getIcon()}</span>
      {showLabel && <span>{displayLabel}</span>}
    </span>
  )
);
BadgeSpan.displayName = "BadgeSpan";

export function INECBadge({ nivel, label, size = 'sm', showLabel = true, showTooltip = true }: INECBadgeProps) {
  const displayLabel = label || `Nível ${nivel}`;
  const description = inecDescriptions[nivel] || inecDescriptions[0];
  
  const getColorClass = () => {
    switch (nivel) {
      case 5: return 'badge-inec-5';
      case 4: return 'badge-inec-4';
      case 3: return 'badge-inec-3';
      case 2: return 'badge-inec-2';
      case 1: return 'badge-inec-1';
      case 0: return 'badge-inec-0';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const getIcon = () => {
    if (nivel >= 4) return '🟢';
    if (nivel === 3) return '🟡';
    return '🔴';
  };

  if (!showTooltip) {
    return (
      <BadgeSpan 
        nivel={nivel} 
        displayLabel={displayLabel} 
        showLabel={showLabel} 
        size={size} 
        getColorClass={getColorClass} 
        getIcon={getIcon} 
      />
    );
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <BadgeSpan 
            nivel={nivel} 
            displayLabel={displayLabel} 
            showLabel={showLabel} 
            size={size} 
            getColorClass={getColorClass} 
            getIcon={getIcon} 
          />
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="max-w-sm p-0 bg-popover border shadow-lg"
          sideOffset={8}
        >
          <div className="p-3 space-y-2">
            <div className="font-bold text-sm text-foreground border-b pb-2">
              {description.title}
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground font-medium min-w-[60px]">Energia:</span>
                <span>{description.energy}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground font-medium min-w-[60px]">Internet:</span>
                <span>{description.internet}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground font-medium min-w-[60px]">Wi-Fi:</span>
                <span>{description.wifi}</span>
              </div>
            </div>
            <div className="pt-2 border-t text-xs font-medium">
              {description.status}
            </div>
            <div className="pt-1 text-[10px] text-muted-foreground italic">
              Fonte: Nota Técnica MEC nº 182/2025 — ENEC
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Função utilitária para explicar o cálculo do INEC
export function getINECExplanation(nivel: number): string {
  return inecDescriptions[nivel]?.status || "Nível não identificado";
}

// Árvore de decisão resumida
export const inecDecisionTree = `
📊 ÁRVORE DE DECISÃO DO INEC

1️⃣ Possui energia adequada?
   ├─ NÃO → Nível 0
   └─ SIM → continua

2️⃣ Possui internet?
   ├─ NÃO → Nível 0
   └─ SIM → continua

3️⃣ Velocidade adequada? (≥1 Mbps/aluno, mín. 50 Mbps)
   ├─ NÃO/Não monitorada → Possui Wi-Fi?
   │   ├─ NÃO → Nível 1
   │   └─ SIM → Nível 2
   └─ SIM → continua

4️⃣ Possui Wi-Fi?
   ├─ NÃO → Nível 3
   └─ SIM → continua

5️⃣ Wi-Fi suficiente? (≥1 AP a cada 2 ambientes)
   ├─ NÃO/Insuficiente → Nível 4
   └─ SIM → Nível 5

📌 Parâmetros (Resolução CEnec nº 2 e 3/2024):
• Velocidade: 1 Mbps por aluno no maior turno, mínimo 50 Mbps
• Wi-Fi: 1 Access Point a cada 2 ambientes escolares
• Apenas níveis 4 e 5 são considerados adequados para uso pedagógico
`;
