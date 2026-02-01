import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Building2, 
  Snowflake, 
  Wrench, 
  ClipboardList, 
  MessageSquare,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Obra {
  status: 'em_execucao' | 'concluida' | 'pendente';
  tipo: string;
  valor: number;
  descricao: string;
}

interface InfrastructureData {
  ambientes_existentes: string;
  climatizacao: {
    subestacao: string;
    climatizada: boolean;
  };
  obras: Obra[];
  plano_intervencao: {
    ambientes_faltantes: string;
    valor_estimado: number;
  };
  observacoes: string;
}

interface InfrastructureTabProps {
  data: InfrastructureData | null;
}

// Parse ambientes string into array of items
function parseAmbientes(ambientesStr: string): { tipo: string; quantidade?: number }[] {
  if (!ambientesStr || ambientesStr === '-') return [];
  
  return ambientesStr.split(' - ').map(item => {
    const match = item.match(/^(\d+)\s+(.+)$/);
    if (match) {
      return { quantidade: parseInt(match[1]), tipo: match[2] };
    }
    return { tipo: item };
  });
}

// Get icon for ambiente type
function getAmbienteIcon(tipo: string): string {
  const tipoLower = tipo.toLowerCase();
  if (tipoLower.includes('sala')) return '🏫';
  if (tipoLower.includes('laboratório') || tipoLower.includes('lab')) return '🔬';
  if (tipoLower.includes('biblioteca')) return '📚';
  if (tipoLower.includes('refeitório') || tipoLower.includes('cozinha')) return '🍽️';
  if (tipoLower.includes('quadra')) return '🏃';
  if (tipoLower.includes('vestiário')) return '🚿';
  if (tipoLower.includes('saúde') || tipoLower.includes('aee')) return '🏥';
  if (tipoLower.includes('mediação') || tipoLower.includes('kit')) return '📺';
  return '🏢';
}

// Format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
}

export function InfrastructureTab({ data }: InfrastructureTabProps) {
  const [obsOpen, setObsOpen] = useState(false);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Dados de infraestrutura não disponíveis</p>
      </div>
    );
  }

  const ambientes = parseAmbientes(data.ambientes_existentes);
  const hasObras = data.obras && data.obras.length > 0;
  const hasPlanIntervencao = data.plano_intervencao && 
    (data.plano_intervencao.ambientes_faltantes || data.plano_intervencao.valor_estimado > 0);

  return (
    <div className="space-y-4">
      {/* Ambientes Existentes */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Ambientes Existentes</h4>
        </div>
        {ambientes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {ambientes.map((amb, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="text-sm py-1.5 px-3"
              >
                <span className="mr-1.5">{getAmbienteIcon(amb.tipo)}</span>
                {amb.quantidade ? `${amb.tipo} (${amb.quantidade})` : amb.tipo}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum ambiente registrado</p>
        )}
      </div>

      {/* Climatização */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Snowflake className="h-5 w-5 text-info" />
          <h4 className="font-semibold">Climatização</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground text-xs mb-1">Subestação</p>
            <p className="font-medium">{data.climatizacao?.subestacao || 'Não informado'}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground text-xs mb-1">Status</p>
            <p className={cn(
              "font-medium flex items-center gap-1.5",
              data.climatizacao?.climatizada ? "text-success" : "text-muted-foreground"
            )}>
              {data.climatizacao?.climatizada ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Climatizada
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  Não climatizada
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Obras em Andamento */}
      {hasObras && (
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="h-5 w-5 text-warning" />
            <h4 className="font-semibold">Obras e Serviços</h4>
          </div>
          <div className="space-y-2">
            {data.obras.map((obra, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-3 rounded-lg border-l-4",
                  obra.status === 'concluida' && "bg-success/5 border-l-success",
                  obra.status === 'em_execucao' && "bg-warning/5 border-l-warning",
                  obra.status === 'pendente' && "bg-muted/50 border-l-muted-foreground"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {obra.status === 'concluida' && <CheckCircle2 className="h-4 w-4 text-success" />}
                      {obra.status === 'em_execucao' && <Clock className="h-4 w-4 text-warning" />}
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          obra.status === 'concluida' && "border-success text-success",
                          obra.status === 'em_execucao' && "border-warning text-warning"
                        )}
                      >
                        {obra.status === 'concluida' ? 'Concluída' : 
                         obra.status === 'em_execucao' ? 'Em execução' : 'Pendente'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{obra.tipo}</span>
                    </div>
                    <p className="text-sm">{obra.descricao}</p>
                  </div>
                  <p className="font-semibold text-sm whitespace-nowrap">
                    {formatCurrency(obra.valor)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plano de Intervenção */}
      {hasPlanIntervencao && (
        <div className="p-4 border rounded-lg border-dashed border-primary/30 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Plano de Intervenção</h4>
          </div>
          <div className="space-y-2 text-sm">
            {data.plano_intervencao.ambientes_faltantes && (
              <div>
                <p className="text-muted-foreground text-xs mb-1">Ambientes Faltantes</p>
                <p className="font-medium">{data.plano_intervencao.ambientes_faltantes}</p>
              </div>
            )}
            {data.plano_intervencao.valor_estimado > 0 && (
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-muted-foreground">Valor Estimado</p>
                <p className="font-bold text-lg text-primary">
                  {formatCurrency(data.plano_intervencao.valor_estimado)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Observações (Collapsible) */}
      {data.observacoes && data.observacoes !== '-' && (
        <Collapsible open={obsOpen} onOpenChange={setObsOpen}>
          <div className="p-4 border rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <h4 className="font-semibold">Observações</h4>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                obsOpen && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {data.observacoes}
              </p>
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}

      {/* Empty state if no data */}
      {!hasObras && !hasPlanIntervencao && ambientes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-2 opacity-30" />
          <p>Dados de infraestrutura ainda não cadastrados</p>
        </div>
      )}
    </div>
  );
}
