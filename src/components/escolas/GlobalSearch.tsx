import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Escola } from "@/data/schoolsData";
import { INECBadge } from "./INECBadge";

interface GlobalSearchProps {
  onSearch: (term: string) => void;
  onSelectSchool?: (escola: Escola) => void;
  escolas?: Escola[];
  placeholder?: string;
  className?: string;
}

export function GlobalSearch({ 
  onSearch,
  onSelectSchool,
  escolas = [],
  placeholder = "Buscar por INEP, Nome da Escola ou Município...",
  className 
}: GlobalSearchProps) {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filtrar escolas baseado no termo de busca
  const filteredEscolas = value.length >= 2
    ? escolas.filter(e => 
        e.escola.toLowerCase().includes(value.toLowerCase()) ||
        e.cod_inep.includes(value) ||
        e.municipio.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8)
    : [];
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
    setIsOpen(newValue.length >= 2);
  }, [onSearch]);
  
  const handleClear = useCallback(() => {
    setValue("");
    onSearch("");
    setIsOpen(false);
  }, [onSearch]);
  
  const handleSelect = useCallback((escola: Escola) => {
    onSelectSchool?.(escola);
    setIsOpen(false);
  }, [onSelectSchool]);
  
  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => value.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="pl-11 pr-10 h-12 text-base bg-card border-border rounded-xl 
                     focus:border-primary focus:ring-2 focus:ring-primary/20
                     placeholder:text-muted-foreground/70"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Limpar busca</span>
          </Button>
        )}
      </div>
      
      {/* Dropdown de resultados */}
      {isOpen && filteredEscolas.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b bg-muted/50">
            <span className="text-xs text-muted-foreground">
              {filteredEscolas.length} resultado(s) encontrado(s) — clique para ver detalhes
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {filteredEscolas.map((escola) => (
              <button
                key={escola.cod_inep}
                onClick={() => handleSelect(escola)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left border-b last:border-b-0"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{escola.escola}</p>
                  <p className="text-xs text-muted-foreground">
                    {escola.municipio} • INEP: {escola.cod_inep}
                  </p>
                </div>
                <INECBadge nivel={escola.inec_nivel} size="sm" />
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isOpen && value.length >= 2 && filteredEscolas.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-xl shadow-lg z-50 p-4 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma escola encontrada</p>
        </div>
      )}
    </div>
  );
}
