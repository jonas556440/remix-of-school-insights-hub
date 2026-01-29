import { useState, useMemo, useCallback } from "react";
import { 
  School, 
  Building2, 
  Users, 
  Award, 
  AlertTriangle,
  GraduationCap,
  ArrowLeft
} from "lucide-react";
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
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <School className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Escolas 2026</h1>
                <p className="text-xs text-muted-foreground">SEDUC-PI • Conectividade Educacional</p>
              </div>
            </div>
            
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <GlobalSearch onSearch={handleSearch} />
            </div>
            
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
          
          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <GlobalSearch onSearch={handleSearch} />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* KPIs */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📊 Visão Geral — Piauí 2026
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <KPICard
              title="Total de Escolas"
              value={kpis.total}
              icon={School}
              variant="primary"
            />
            <KPICard
              title="Estaduais"
              value={kpis.estaduais}
              subtitle={`${((kpis.estaduais / kpis.total) * 100).toFixed(0)}% do total`}
              icon={Building2}
            />
            <KPICard
              title="Municipais"
              value={kpis.municipais}
              subtitle={`${((kpis.municipais / kpis.total) * 100).toFixed(0)}% do total`}
              icon={Users}
            />
            <KPICard
              title="Federais"
              value={kpis.federais}
              subtitle={`${((kpis.federais / kpis.total) * 100).toFixed(0)}% do total`}
              icon={GraduationCap}
            />
            <KPICard
              title="INEC 5 (Excelente)"
              value={kpis.inec_5}
              subtitle={`${((kpis.inec_5 / kpis.total) * 100).toFixed(0)}% do total`}
              icon={Award}
              variant="success"
            />
            <KPICard
              title="Críticas (INEC ≤2)"
              value={kpis.inec_critico}
              subtitle={`${((kpis.inec_critico / kpis.total) * 100).toFixed(0)}% do total`}
              icon={AlertTriangle}
              variant="danger"
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
                Conectividade por Dependência Administrativa
              </h3>
              <DependencyBarChart data={chartData.conectividadePorDep} />
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
