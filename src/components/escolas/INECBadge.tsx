import { cn } from "@/lib/utils";

interface INECBadgeProps {
  nivel: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeStyles = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function INECBadge({ nivel, label, size = 'sm', showLabel = true }: INECBadgeProps) {
  const displayLabel = label || `Nível ${nivel}`;
  
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
  
  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap",
        getColorClass(),
        sizeStyles[size]
      )}
    >
      <span className="text-xs" role="img" aria-hidden>{getIcon()}</span>
      {showLabel && <span>{displayLabel}</span>}
    </span>
  );
}
