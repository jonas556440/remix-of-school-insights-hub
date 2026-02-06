import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { MapPin, Building2, Wifi, Zap, Globe, FileText, Camera, Users, Radio, Gauge, Wrench, Phone, Mail, GraduationCap, Clock } from "lucide-react";
import type { Escola } from "@/data/schoolsData";
import { INECBadge } from "./INECBadge";
import { PhotoGallery } from "./PhotoGallery";
import { explicarINECCalculado } from "@/utils/calcularINEC";
import { MiniMap } from "./MiniMap";
import { InfrastructureTab } from "./InfrastructureTab";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SchoolDetailModalProps {
  escola: Escola | null;
  open: boolean;
  onClose: () => void;
}

// Mock function to simulate API call for photos
// Replace this with actual API call when backend is ready
const fetchSchoolPhotos = async (codInep: string): Promise<{ id: string; url: string }[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Return mock photos for demonstration
  // In production, this would call your API endpoint
  const mockPhotos = Array.from({ length: 32 }, (_, i) => ({
    id: `${codInep}-photo-${i + 1}`,
    url: `https://picsum.photos/seed/${codInep}-${i}/400/400`,
  }));
  
  return mockPhotos;
};

export function SchoolDetailModal({ escola, open, onClose }: SchoolDetailModalProps) {
  const [observacoes, setObservacoes] = useState("");
  const [photos, setPhotos] = useState<{ id: string; url: string }[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  
  // Fetch photos when modal opens
  useEffect(() => {
    if (open && escola) {
      setPhotosLoading(true);
      fetchSchoolPhotos(escola.cod_inep)
        .then(setPhotos)
        .finally(() => setPhotosLoading(false));
    } else {
      setPhotos([]);
    }
  }, [open, escola?.cod_inep]);
  
  if (!escola) return null;
  
  const getStatusIcon = (status: string, type: 'internet' | 'wifi' | 'energia') => {
    const isGood = type === 'energia' 
      ? status.toLowerCase().includes('adequada') && !status.toLowerCase().includes('inadequada')
      : type === 'wifi'
        ? status.toLowerCase().includes('adequado') && !status.toLowerCase().includes('insuficiente')
        : status.toLowerCase().includes('adequada') && !status.toLowerCase().includes('inadequada');
    
    return isGood ? '✅' : '⚠️';
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold leading-tight">
                {escola.escola}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="font-mono">
                  INEP: {escola.cod_inep}
                </Badge>
                <Badge 
                  className={cn(
                    escola.dependencia === "Estadual" && "bg-primary/10 text-primary border-primary/20",
                    escola.dependencia === "Municipal" && "bg-purple-100 text-purple-700 border-purple-200",
                    escola.dependencia === "Federal" && "bg-cyan-100 text-cyan-700 border-cyan-200"
                  )}
                  variant="outline"
                >
                  {escola.dependencia}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="geral" className="mt-4 flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="geral" className="gap-1.5">
              <FileText className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="conectividade" className="gap-1.5">
              <Wifi className="h-4 w-4" />
              Conectividade
            </TabsTrigger>
            <TabsTrigger value="infraestrutura" className="gap-1.5">
              <Wrench className="h-4 w-4" />
              Infraestrutura
            </TabsTrigger>
            <TabsTrigger value="fotos" className="gap-1.5">
              <Camera className="h-4 w-4" />
              Fotos
            </TabsTrigger>
          </TabsList>
          
          {/* Tab Geral */}
          <TabsContent value="geral" className="mt-4 space-y-4 min-h-[450px]">
            {/* Situação e Localização */}
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant={escola.nomeSituacaoFuncionamento?.includes('ATIVIDADE') ? 'default' : 'destructive'}>
                {escola.nomeSituacaoFuncionamento || 'EM ATIVIDADE'}
              </Badge>
              <Badge variant="outline">
                📍 {escola.localizacao || 'Urbana'}
              </Badge>
              {escola.modaLidadesDeEnsino && escola.modaLidadesDeEnsino.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {escola.modaLidadesDeEnsino.length} modalidade{escola.modaLidadesDeEnsino.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            {/* Endereço e Contatos */}
            {escola.endereco && (
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                  <p className="font-semibold">{escola.endereco}</p>
                  <p className="text-sm text-muted-foreground">{escola.municipio}, {escola.uf}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p className="font-semibold">{escola.fone || '-'}</p>
                  {escola.fone2 && (
                    <p className="text-sm text-muted-foreground">{escola.fone2}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                  <p className="font-semibold text-sm break-all">{escola.email || '-'}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">GRE</p>
                  <p className="font-semibold">{escola.GRE}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Código Município</p>
                  <p className="font-semibold font-mono">{escola.codINEPMunicipio}</p>
                </div>
              </div>
            </div>
            
            {/* Alunos por Turno */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">Alunos por Turno</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {escola.totalAlunosTurno && escola.totalAlunosTurno.length > 0 ? (
                  escola.totalAlunosTurno.map((turno, idx) => (
                    <div key={idx} className="p-3 bg-background rounded-lg text-center border">
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        {turno.Turno}
                      </p>
                      <p className="font-bold text-lg">{turno.TotalAluno}</p>
                      <p className="text-xs text-muted-foreground">alunos</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center text-sm text-muted-foreground py-2">
                    <p>Matrículas (maior turno): <strong>{escola.matriculas_maior_turno}</strong> alunos</p>
                  </div>
                )}
              </div>
              {escola.totalAlunosTurno && escola.totalAlunosTurno.length > 0 && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-muted-foreground">
                    Total: <strong>{escola.totalAlunosTurno.reduce((sum, t) => sum + t.TotalAluno, 0)}</strong> alunos
                  </p>
                </div>
              )}
            </div>
            
            {/* Modalidades de Ensino */}
            {escola.modaLidadesDeEnsino && escola.modaLidadesDeEnsino.length > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">Modalidades de Ensino</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {escola.modaLidadesDeEnsino.map((mod, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {mod.ModalidadeEnsino}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Modalidades de Ensino (duplicado - remover) */}
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Diligência</p>
              <p className="font-semibold">
                {escola.diligencia === '-' ? 'Nenhuma diligência registrada' : escola.diligencia}
              </p>
            </div>
            
            {/* Mini Mapa e Observações */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Observações</p>
                <Textarea
                  placeholder="Adicione observações sobre esta escola..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={4}
                />
                <Button size="sm" className="mt-2">
                  Salvar Observações
                </Button>
              </div>
              
              {/* Mini Mapa */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Localização
                </p>
                <div className="h-[180px]">
                  <MiniMap 
                    latitude={escola.latitude}
                    longitude={escola.longitude}
                    schoolName={escola.escola}
                    municipio={escola.municipio}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Tab Conectividade */}
          <TabsContent value="conectividade" className="mt-4 space-y-4 min-h-[450px]">
            {/* INEC Badge - Oficial vs Calculado */}
            <div className="p-6 bg-muted/50 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-2">INEC Oficial (MEC)</p>
                  <INECBadge nivel={escola.inec_nivel} label={escola.inec} size="lg" showTooltip={true} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-2">INEC Calculado (Dados Reais)</p>
                  <INECBadge nivel={escola.inec_nivel_calculado} label={`Nível ${escola.inec_nivel_calculado}`} size="lg" showTooltip={true} />
                </div>
              </div>
              {escola.inec_divergente && (
                <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm">
                  <span className="text-warning font-medium">
                    ⚠️ Divergência: Oficial ({escola.inec_nivel}) ≠ Calculado ({escola.inec_nivel_calculado})
                  </span>
                </div>
              )}
              <p className="text-xs text-muted-foreground text-center">
                📐 {explicarINECCalculado(escola)}
              </p>
            </div>
            
            {/* Seção de Velocidade de Internet */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="h-5 w-5 text-info" />
                <h4 className="font-semibold">Velocidade de Internet</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Matrículas (maior turno)</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {escola.matriculas_maior_turno} alunos
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Velocidade Mínima</p>
                  <p className="font-semibold">{escola.velocidade_minima} Mbps</p>
                  <p className="text-xs text-muted-foreground">
                    (1 Mbps/aluno, mín. 50 Mbps)
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Contratada: <strong>{escola.velocidade_contratada} Mbps</strong></span>
                  <span className={escola.velocidade_contratada >= escola.velocidade_minima ? "text-success" : "text-destructive"}>
                    {escola.velocidade_contratada >= escola.velocidade_minima ? "✅ Adequada" : "❌ Inadequada"}
                  </span>
                </div>
                <Progress 
                  value={Math.min((escola.velocidade_contratada / escola.velocidade_minima) * 100, 100)} 
                  className="h-2"
                />
              </div>
            </div>
            
            {/* Seção de Access Points / Wi-Fi */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-purple-500" />
                  <h4 className="font-semibold">Cobertura Wi-Fi (Access Points)</h4>
                </div>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  📡 Tempo real: Ruckus/Omada
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-muted-foreground text-xs">Ambientes</p>
                  <p className="font-bold text-lg">{escola.compartimentos}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-muted-foreground text-xs">APs Necessários</p>
                  <p className="font-bold text-lg">{escola.aps_necessarios}</p>
                  <p className="text-[10px] text-muted-foreground">1 AP / 2 amb.</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-muted-foreground text-xs">APs Instalados</p>
                  <p className={cn(
                    "font-bold text-lg",
                    escola.aps_atual >= escola.aps_necessarios ? "text-success" : "text-destructive"
                  )}>
                    {escola.aps_atual}
                  </p>
                </div>
              </div>
              {escola.deficit_aps > 0 && (
                <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg text-sm">
                  <span className="text-destructive font-medium">
                    ⚠️ Déficit de {escola.deficit_aps} Access Point{escola.deficit_aps > 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {escola.deficit_aps === 0 && (
                <div className="flex items-center gap-2 p-2 bg-success/10 border border-success/20 rounded-lg text-sm">
                  <span className="text-success font-medium">
                    ✅ Cobertura Wi-Fi adequada
                  </span>
                </div>
              )}
            </div>
            
            {/* Status resumido de infraestrutura */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-info" />
                  <div>
                    <p className="font-medium">Internet</p>
                    <p className="text-sm text-muted-foreground">{escola.internet}</p>
                  </div>
                </div>
                <span className="text-xl">{getStatusIcon(escola.internet, 'internet')}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Wifi className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Wi-Fi</p>
                    <p className="text-sm text-muted-foreground">{escola.wifi}</p>
                  </div>
                </div>
                <span className="text-xl">{getStatusIcon(escola.wifi, 'wifi')}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-warning" />
                  <div>
                    <p className="font-medium">Energia</p>
                    <p className="text-sm text-muted-foreground">{escola.energia}</p>
                  </div>
                </div>
                <span className="text-xl">{getStatusIcon(escola.energia, 'energia')}</span>
              </div>
            </div>
          </TabsContent>
          
          {/* Tab Infraestrutura */}
          <TabsContent value="infraestrutura" className="mt-4 min-h-[450px]">
            <InfrastructureTab data={escola.infraestrutura || null} />
          </TabsContent>
          
          {/* Tab Fotos */}
          <TabsContent value="fotos" className="mt-4">
            <PhotoGallery photos={photos} isLoading={photosLoading} />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button>
            Editar Escola
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
