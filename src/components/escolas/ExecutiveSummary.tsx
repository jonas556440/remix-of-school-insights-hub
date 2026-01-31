import type { KPIs } from "@/data/schoolsData";
import { Target, AlertTriangle, MapPin, Wifi, Zap, Calendar } from "lucide-react";

interface ExecutiveSummaryProps {
  kpis: KPIs;
}

export function ExecutiveSummary({ kpis }: ExecutiveSummaryProps) {
  const pctExcelencia = ((kpis.inec_5 / kpis.total) * 100).toFixed(1);
  const pctCriticas = ((kpis.inec_critico / kpis.total) * 100).toFixed(1);
  const pctWifi = ((kpis.wifi_adequado / kpis.total) * 100).toFixed(1);
  const pctVelocidade = ((kpis.escolas_velocidade_ok / kpis.total) * 100).toFixed(1);
  
  const items = [
    {
      icon: Target,
      value: `${pctExcelencia}% (${kpis.inec_5.toLocaleString('pt-BR')} escolas)`,
      label: 'possuem conectividade excelente (INEC 5)',
    },
    {
      icon: AlertTriangle,
      value: `${kpis.inec_critico.toLocaleString('pt-BR')} escolas (${pctCriticas}%)`,
      label: 'necessitam intervenção urgente (INEC ≤ 2)',
    },
    {
      icon: MapPin,
      value: `${kpis.total_municipios} municípios, ${kpis.total_gres} GREs`,
      label: 'cobertura da rede estadual no Piauí',
    },
    {
      icon: Wifi,
      value: `${pctWifi}% (${kpis.wifi_adequado.toLocaleString('pt-BR')} escolas)`,
      label: 'possuem Wi-Fi adequado',
    },
    {
      icon: Zap,
      value: `${pctVelocidade}% (${kpis.escolas_velocidade_ok.toLocaleString('pt-BR')} escolas)`,
      label: 'possuem velocidade de internet adequada',
    },
    {
      icon: Calendar,
      value: 'Última atualização:',
      label: new Date().toLocaleDateString('pt-BR'),
    },
  ];

  return (
    <div className="bg-gradient-hero rounded-2xl p-6 text-white shadow-lg">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        💡 Resumo Executivo — Rede Estadual
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm
                       transition-all duration-200 hover:bg-white/15 hover:-translate-y-0.5"
          >
            <item.icon className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-sm">{item.value}</span>
              <span className="text-xs opacity-90">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
