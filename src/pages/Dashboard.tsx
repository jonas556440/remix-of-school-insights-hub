import { School } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoSeducPi from "@/assets/logo-seduc-pi.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getEscolas } from "@/data/schoolsData";

interface DashboardCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  color?: "blue" | "green" | "orange" | "purple" | "red";
}

function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  onClick,
  color = "blue" 
}: DashboardCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    green: "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
    orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    red: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-6 text-white
        bg-gradient-to-br ${colorClasses[color]}
        shadow-lg hover:shadow-xl
        transform hover:scale-[1.02] active:scale-[0.98]
        transition-all duration-200 ease-out
        text-left w-full group
      `}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20" />
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
      </div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className="text-4xl font-bold tracking-tight">
            {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
          </p>
          {subtitle && (
            <p className="text-sm text-white/70 mt-2">{subtitle}</p>
          )}
        </div>
        
        <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
          <Icon className="h-7 w-7" />
        </div>
      </div>
      
      {/* Click indicator */}
      <div className="absolute bottom-3 right-3 text-xs text-white/60 flex items-center gap-1">
        <span>Acessar</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const totalEscolas = getEscolas().length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={logoSeducPi} 
                alt="Secretaria da Educação - SEDUC | Governo do Piauí" 
                className="h-24 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Painel SEDUC-PI</h1>
                <p className="text-sm text-muted-foreground">Sistema de Gestão Educacional</p>
              </div>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Bem-vindo ao Painel de Gestão
          </h2>
          <p className="text-muted-foreground">
            Selecione uma área para acessar as informações detalhadas.
          </p>
        </div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Card: Entidades (Escolas) */}
          <DashboardCard
            title="Entidades"
            value={totalEscolas}
            subtitle="Escolas estaduais cadastradas"
            icon={School}
            color="blue"
            onClick={() => navigate("/escolas")}
          />
          
          {/* Placeholder para cards futuros */}
          {/* 
          <DashboardCard
            title="Alunos"
            value={0}
            subtitle="Total de matrículas"
            icon={Users}
            color="green"
            onClick={() => navigate("/alunos")}
          />
          */}
        </div>
      </main>
    </div>
  );
}
