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
import logoSeducPi from "@/assets/logo-seduc-pi.png";
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
              {/* Logo SEDUC-PI */}
              <img 
                src={logoSeducPi} 
                alt="Secretaria da Educação - SEDUC | Governo do Piauí" 
                className="h-24 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Escolas 2026</h1>
                <p className="text-sm text-muted-foreground">Painel de Conectividade • Base ENEC/MEC</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => window.location.href = "/"}
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Busca Global */}
        <section>
          <div className="max-w-2xl mx-auto">
            <GlobalSearch 
              onSearch={handleSearch} 
              onSelectSchool={handleRowClick}
              escolas={allEscolas}
            />
          </div>
        </section>
        
        {/* KPIs */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📊 Visão Geral — Rede Estadual do Piauí
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
              tooltip="Quantidade total de Access Points necessários para atingir a meta de 1 AP a cada 2 ambientes escolares. 📡 Dados em tempo real via controladoras Ruckus e Omada."
            />
            <KPICard
              title="INEC 5 (Excelente)"
              value={kpis.inec_5}
              subtitle={`Oficial: ${kpis.inec_5} • Calculado: ${kpis.inec_calc_5}`}
              icon={Award}
              variant="success"
              tooltip="INEC Oficial (fonte MEC) vs Calculado (árvore de decisão com dados reais de energia, velocidade e Wi-Fi). A divergência indica escolas cujo nível real difere do oficial."
            />
            <KPICard
              title="Críticas (INEC ≤2)"
              value={kpis.inec_critico}
              subtitle={`Oficial: ${kpis.inec_critico} • Calculado: ${kpis.inec_calc_critico}`}
              icon={AlertTriangle}
              variant="danger"
              tooltip="Escolas em situação crítica. INEC Oficial (MEC) vs Calculado com dados reais. A divergência pode indicar dados desatualizados na base oficial."
            />
            <KPICard
              title="INEC Divergente"
              value={kpis.inec_divergentes}
              subtitle={`${((kpis.inec_divergentes / kpis.total) * 100).toFixed(0)}% das escolas`}
              icon={Gauge}
              variant="warning"
              tooltip="Escolas onde o INEC oficial (fonte MEC) difere do INEC calculado pela árvore de decisão com os dados reais de energia, velocidade de internet e Access Points."
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
                Distribuição por Nível INEC <span className="text-xs text-muted-foreground font-normal">(Oficial)</span>
              </h3>
              <INECPieChart data={chartData.inecDistribution} />
            </div>
            
            <div className="bg-card border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4 pb-3 border-b">
                Distribuição por Nível INEC <span className="text-xs text-muted-foreground font-normal">(Calculado)</span>
              </h3>
              <INECPieChart data={chartData.inecCalculadoDistribution} />
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
              <h3 className="font-semibold text-foreground mb-1 pb-3 border-b">
                Déficit de Access Points por GRE
              </h3>
              <p className="text-[10px] text-muted-foreground mb-3 -mt-2">📡 Dados em tempo real via controladoras Ruckus e Omada</p>
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
              tooltip="Escolas que possuem menos Access Points instalados do que o mínimo recomendado (1 AP a cada 2 ambientes escolares). 📡 Dados em tempo real via controladoras Ruckus e Omada."
            />
            <KPICard
              title="Total Déficit APs"
              value={kpis.total_deficit_aps}
              subtitle={`${kpis.total_aps_atual.toLocaleString('pt-BR')} instalados de ${kpis.total_aps_necessarios.toLocaleString('pt-BR')} necessários`}
              icon={Wifi}
              variant="primary"
              tooltip="Quantidade total de Access Points que precisam ser adquiridos e instalados para atender à meta de 1 AP a cada 2 ambientes. 📡 Dados em tempo real via controladoras Ruckus e Omada."
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
        
        {/* KPIs de Localização e Situação */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🏫 Perfil das Escolas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <KPICard
              title="Escolas Urbanas"
              value={kpis.escolas_urbanas}
              subtitle={`${((kpis.escolas_urbanas / kpis.total) * 100).toFixed(0)}% do total`}
              icon={School}
              tooltip="Escolas localizadas em áreas urbanas dos municípios."
            />
            <KPICard
              title="Escolas Rurais"
              value={kpis.escolas_rurais}
              subtitle={`${((kpis.escolas_rurais / kpis.total) * 100).toFixed(0)}% do total`}
              icon={School}
              tooltip="Escolas localizadas em áreas rurais dos municípios."
            />
            <KPICard
              title="Em Atividade"
              value={kpis.escolas_ativas}
              subtitle="funcionando normalmente"
              icon={School}
              variant="success"
              tooltip="Escolas com situação de funcionamento 'Em Atividade'."
            />
            <KPICard
              title="Total de Alunos"
              value={kpis.total_alunos.toLocaleString('pt-BR')}
              subtitle="matriculados"
              icon={GraduationCap}
              variant="primary"
              tooltip="Soma de todos os alunos matriculados em todos os turnos das escolas estaduais."
            />
            <KPICard
              title="Ensino Médio"
              value={kpis.modalidade_medio}
              subtitle="escolas"
              icon={GraduationCap}
              tooltip="Escolas que oferecem Ensino Médio regular ou integral."
            />
            <KPICard
              title="Ensino Integral"
              value={kpis.modalidade_integral}
              subtitle="escolas"
              icon={GraduationCap}
              tooltip="Escolas que oferecem modalidade de ensino em tempo integral."
            />
          </div>
        </section>
        
        {/* KPIs de Alunos por Turno */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📚 Distribuição de Alunos por Turno
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              title="Turno Manhã"
              value={kpis.alunos_manha.toLocaleString('pt-BR')}
              subtitle="alunos"
              icon={GraduationCap}
              tooltip="Total de alunos matriculados no turno da manhã."
            />
            <KPICard
              title="Turno Tarde"
              value={kpis.alunos_tarde.toLocaleString('pt-BR')}
              subtitle="alunos"
              icon={GraduationCap}
              tooltip="Total de alunos matriculados no turno da tarde."
            />
            <KPICard
              title="Turno Noite"
              value={kpis.alunos_noite.toLocaleString('pt-BR')}
              subtitle="alunos"
              icon={GraduationCap}
              tooltip="Total de alunos matriculados no turno da noite."
            />
            <KPICard
              title="Integral"
              value={kpis.alunos_integral.toLocaleString('pt-BR')}
              subtitle="alunos"
              icon={GraduationCap}
              tooltip="Total de alunos matriculados em período integral."
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
