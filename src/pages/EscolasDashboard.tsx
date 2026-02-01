import { useState, useMemo, useCallback } from "react";
import { 
  School, 
  Award, 
  AlertTriangle,
  GraduationCap,
  ArrowLeft,
  Wifi,
  Gauge
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { 
  getEscolas, 
  calcularKPIs, 
  cardsPredefinidos, 
  getChartData,
  type Escola,
  type CardPredefinido
} from "@/data/schoolsData";
import { KPICard } from "@/components/escolas/KPICard";
import { FilterCard } from "@/components/escolas/FilterCard";
import { GlobalSearch } from "@/components/escolas/GlobalSearch";
import { SchoolsTable } from "@/components/escolas/SchoolsTable";
import { SchoolDetailModal } from "@/components/escolas/SchoolDetailModal";
import { ExecutiveSummary } from "@/components/escolas/ExecutiveSummary";
import { INECPieChart } from "@/components/escolas/charts/INECPieChart";
import { DependencyBarChart } from "@/components/escolas/charts/DependencyBarChart";
import { MunicipiosChart } from "@/components/escolas/charts/MunicipiosChart";
import { InfraDonutChart } from "@/components/escolas/charts/InfraDonutChart";
import { APsDeficitChart } from "@/components/escolas/charts/APsDeficitChart";
import { VelocidadeChart } from "@/components/escolas/charts/VelocidadeChart";

export default function EscolasDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<CardPredefinido | null>(null);
  const [selectedEscola, setSelectedEscola] = useState<Escola | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Dados
  const allEscolas = useMemo(() => getEscolas(), []);
  const kpis = useMemo(() => calcularKPIs(allEscolas), [allEscolas]);
  const chartData = useMemo(() => getChartData(allEscolas), [allEscolas]);
  
  // Escolas filtradas
  const filteredEscolas = useMemo(() => {
    let result = allEscolas;
    
    // Aplicar filtro de card ativo
    if (activeFilter) {
      result = result.filter(activeFilter.filter);
    }
    
    return result;
  }, [allEscolas, activeFilter]);
  
  // Contagem para cada card
  const cardsComContagem = useMemo(() => {
    return cardsPredefinidos.map(card => ({
      ...card,
      count: allEscolas.filter(card.filter).length,
    }));
  }, [allEscolas]);
  
  // Handlers
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);
  
  const handleCardClick = useCallback((card: CardPredefinido) => {
    if (activeFilter?.id === card.id) {
      setActiveFilter(null);
    } else {
      setActiveFilter(card);
    }
  }, [activeFilter]);
  
  const handleRowClick = useCallback((escola: Escola) => {
    setSelectedEscola(escola);
    setIsModalOpen(true);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEscola(null);
  }, []);
  
  const handleClearFilter = useCallback(() => {
    setActiveFilter(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Espaço para logo retangular */}
              <div className="h-14 w-44 rounded-lg bg-muted/50 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground/60 font-medium">LOGO</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Escolas 2026</h1>
                <p className="text-xs text-muted-foreground">SEDUC-PI • Conectividade Educacional</p>
              </div>
            </div>
            
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <GlobalSearch 
                onSearch={handleSearch} 
                onSelectSchool={handleRowClick}
                escolas={allEscolas}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <GlobalSearch 
              onSearch={handleSearch} 
              onSelectSchool={handleRowClick}
              escolas={allEscolas}
            />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* KPIs */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📊 Visão Geral — Rede Estadual do Piauí
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <KPICard
              title="Escolas Estaduais"
              value={kpis.total}
              icon={School}
              variant="primary"
              tooltip="Total de escolas da rede estadual do Piauí sob gestão da SEDUC-PI."
            />
            <KPICard
              title="Ambientes Escolares"
              value={kpis.total_compartimentos}
              subtitle="salas e espaços"
              icon={GraduationCap}
              tooltip="Soma de todos os ambientes escolares (salas de aula, laboratórios, bibliotecas, etc.) nas escolas estaduais."
            />
            <KPICard
              title="Déficit de APs"
              value={kpis.total_deficit_aps}
              subtitle={`${kpis.escolas_com_deficit} escolas afetadas`}
              icon={Wifi}
              tooltip="Quantidade total de Access Points necessários para atingir a meta de 1 AP a cada 2 ambientes escolares."
            />
            <KPICard
              title="INEC 5 (Excelente)"
              value={kpis.inec_5}
              subtitle={`${((kpis.inec_5 / kpis.total) * 100).toFixed(0)}% das escolas`}
              icon={Award}
              variant="success"
              tooltip="Escolas com nível máximo de conectividade: Wi-Fi adequado (1 AP a cada 2 ambientes) e velocidade de internet ≥ 1 Mbps por aluno."
            />
            <KPICard
              title="Críticas (INEC ≤2)"
              value={kpis.inec_critico}
              subtitle={`${((kpis.inec_critico / kpis.total) * 100).toFixed(0)}% das escolas`}
              icon={AlertTriangle}
              variant="danger"
              tooltip="Escolas em situação crítica: sem internet adequada, déficit de Access Points ou velocidade insuficiente para o número de alunos."
            />
          </div>
        </section>
        
        {/* Charts */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📈 Estatísticas e Indicadores
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4 pb-3 border-b">
                Distribuição por Nível INEC
              </h3>
              <INECPieChart data={chartData.inecDistribution} />
            </div>
            
            <div className="bg-card border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4 pb-3 border-b">
                Conectividade por GRE
              </h3>
              <DependencyBarChart data={chartData.conectividadePorGRE} />
            </div>
            
            <div className="bg-card border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4 pb-3 border-b">
                Top 10 Municípios por Quantidade de Escolas
              </h3>
              <MunicipiosChart data={chartData.topMunicipios} />
            </div>
            
            <div className="bg-card border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4 pb-3 border-b">
                Status da Infraestrutura
              </h3>
              <InfraDonutChart data={chartData.infraStatus} />
            </div>
            
            <div className="bg-card border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4 pb-3 border-b">
                Déficit de Access Points por GRE
              </h3>
              <APsDeficitChart data={chartData.deficitPorGRE} />
            </div>
            
            <div className="bg-card border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4 pb-3 border-b">
                Velocidade de Internet
              </h3>
              <VelocidadeChart data={chartData.velocidadeDistribuicao} />
            </div>
          </div>
        </section>
        
        {/* Novos KPIs de Conectividade */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📡 Indicadores de Conectividade
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              title="Escolas com Déficit AP"
              value={kpis.escolas_com_deficit}
              subtitle={`${((kpis.escolas_com_deficit / kpis.total) * 100).toFixed(0)}% precisam de mais APs`}
              icon={Wifi}
              variant="danger"
              tooltip="Escolas que possuem menos Access Points instalados do que o mínimo recomendado (1 AP a cada 2 ambientes escolares)."
            />
            <KPICard
              title="Total Déficit APs"
              value={kpis.total_deficit_aps}
              subtitle={`${kpis.total_aps_atual.toLocaleString('pt-BR')} instalados de ${kpis.total_aps_necessarios.toLocaleString('pt-BR')} necessários`}
              icon={Wifi}
              variant="primary"
              tooltip="Quantidade total de Access Points que precisam ser adquiridos e instalados para atender à meta de 1 AP a cada 2 ambientes."
            />
            <KPICard
              title="Velocidade Adequada"
              value={kpis.escolas_velocidade_ok}
              subtitle={`${((kpis.escolas_velocidade_ok / kpis.total) * 100).toFixed(0)}% atendem requisito`}
              icon={Gauge}
              variant="success"
              tooltip="Escolas com velocidade de internet ≥ 1 Mbps por aluno no maior turno (mínimo de 50 Mbps), conforme Nota Técnica MEC nº 182/2025."
            />
            <KPICard
              title="Velocidade Insuficiente"
              value={kpis.escolas_velocidade_baixa}
              subtitle={`${((kpis.escolas_velocidade_baixa / kpis.total) * 100).toFixed(0)}% abaixo do mínimo`}
              icon={Gauge}
              tooltip="Escolas cuja velocidade contratada está abaixo do mínimo necessário para atender adequadamente os alunos."
            />
          </div>
        </section>
        
        {/* Executive Summary */}
        <section>
          <ExecutiveSummary kpis={kpis} />
        </section>
        
        {/* Filter Cards */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🎯 Filtros Predefinidos
            {activeFilter && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearFilter}
                className="ml-2 text-muted-foreground"
              >
                Limpar filtro
              </Button>
            )}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {cardsComContagem.map((card) => (
              <FilterCard
                key={card.id}
                card={card}
                count={card.count}
                total={kpis.total}
                onClick={() => handleCardClick(card)}
                isActive={activeFilter?.id === card.id}
              />
            ))}
          </div>
        </section>
        
        {/* Table Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              📋 {activeFilter ? activeFilter.title : 'Todas as Escolas'}
              <span className="text-sm font-normal text-muted-foreground">
                ({filteredEscolas.length.toLocaleString('pt-BR')} escolas)
              </span>
            </h2>
          </div>
          
          <SchoolsTable 
            data={filteredEscolas}
            onRowClick={handleRowClick}
            globalFilter={searchTerm}
          />
        </section>
      </main>
      
      {/* Modal de Detalhes */}
      <SchoolDetailModal
        escola={selectedEscola}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
