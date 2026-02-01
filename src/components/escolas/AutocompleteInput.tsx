import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export function AutocompleteInput({
  value,
  onChange,
  options,
  placeholder = "Filtrar...",
  className,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const MAX_SUGGESTIONS = 30;

  // Filtrar opções baseado no input
  const filteredOptions = inputValue
    ? options.filter((opt) =>
        opt.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, MAX_SUGGESTIONS)
    : options.slice(0, MAX_SUGGESTIONS);

  // Sync with external value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  }, [onChange]);

  const handleSelect = useCallback((option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  }, [onChange]);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="h-9"
      />
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <button
              key={`${option}-${index}`}
              type="button"
              onClick={() => handleSelect(option)}
              className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors",
                option.toLowerCase() === inputValue.toLowerCase() && "bg-accent"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
