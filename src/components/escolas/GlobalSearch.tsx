import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GlobalSearchProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  className?: string;
}

export function GlobalSearch({ 
  onSearch, 
  placeholder = "Buscar por INEP, Nome da Escola ou Município...",
  className 
}: GlobalSearchProps) {
  const [value, setValue] = useState("");
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  }, [onSearch]);
  
  const handleClear = useCallback(() => {
    setValue("");
    onSearch("");
  }, [onSearch]);
  
  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={value}
          onChange={handleChange}
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
      
      {value && (
        <p className="absolute -bottom-5 left-0 text-xs text-muted-foreground">
          Pressione Enter para buscar ou continue digitando...
        </p>
      )}
    </div>
  );
}
