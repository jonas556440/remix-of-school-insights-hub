import { cn } from "@/lib/utils";
import type { CardPredefinido } from "@/data/schoolsData";

interface FilterCardProps {
  card: CardPredefinido;
  count: number;
  total: number;
  onClick: () => void;
  isActive?: boolean;
}

const colorStyles = {
  blue: {
    border: 'border-primary/20 hover:border-primary/50',
    badge: 'bg-primary text-primary-foreground',
    activeBg: 'bg-primary/5',
  },
  red: {
    border: 'border-destructive/20 hover:border-destructive/50',
    badge: 'bg-destructive text-destructive-foreground',
    activeBg: 'bg-destructive/5',
  },
  amber: {
    border: 'border-warning/20 hover:border-warning/50',
    badge: 'bg-warning text-warning-foreground',
    activeBg: 'bg-warning/5',
  },
  indigo: {
    border: 'border-indigo-500/20 hover:border-indigo-500/50',
    badge: 'bg-indigo-500 text-white',
    activeBg: 'bg-indigo-500/5',
  },
  emerald: {
    border: 'border-success/20 hover:border-success/50',
    badge: 'bg-success text-success-foreground',
    activeBg: 'bg-success/5',
  },
  rose: {
    border: 'border-rose-500/20 hover:border-rose-500/50',
    badge: 'bg-rose-500 text-white',
    activeBg: 'bg-rose-500/5',
  },
  purple: {
    border: 'border-purple-500/20 hover:border-purple-500/50',
    badge: 'bg-purple-500 text-white',
    activeBg: 'bg-purple-500/5',
  },
  cyan: {
    border: 'border-cyan-500/20 hover:border-cyan-500/50',
    badge: 'bg-cyan-500 text-white',
    activeBg: 'bg-cyan-500/5',
  },
};

export function FilterCard({ card, count, total, onClick, isActive }: FilterCardProps) {
  const styles = colorStyles[card.color];
  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full text-left rounded-xl border bg-card p-4 transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-card-hover",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        styles.border,
        isActive && styles.activeBg
      )}
    >
      {/* Badge de contagem */}
      <div className={cn(
        "absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold",
        styles.badge
      )}>
        {count.toLocaleString('pt-BR')}
      </div>
      
      {/* Ícone */}
      <span className="text-2xl mb-2 block" role="img" aria-label={card.title}>
        {card.icon}
      </span>
      
      {/* Título */}
      <h3 className="font-semibold text-foreground mb-1 pr-16">
        {card.title}
      </h3>
      
      {/* Descrição */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
        {card.description}
      </p>
      
      {/* Percentual */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", styles.badge)}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {percentage}%
        </span>
      </div>
    </button>
  );
}
