import { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Filter, X } from "lucide-react";
import type { Escola } from "@/data/schoolsData";
import { INECBadge } from "./INECBadge";
import { cn } from "@/lib/utils";

interface SchoolsTableProps {
  data: Escola[];
  onRowClick: (escola: Escola) => void;
  globalFilter?: string;
}

export function SchoolsTable({ data, onRowClick, globalFilter = "" }: SchoolsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showFilters, setShowFilters] = useState(false);

  const columns = useMemo<ColumnDef<Escola>[]>(() => [
    {
      accessorKey: "cod_inep",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          INEP
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue("cod_inep")}</span>
      ),
    },
    {
      accessorKey: "escola",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Escola
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium text-sm max-w-[300px] truncate block">
          {row.getValue("escola")}
        </span>
      ),
    },
    {
      accessorKey: "municipio",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Município
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
    },
    {
      accessorKey: "dependencia",
      header: "Dependência",
      cell: ({ row }) => {
        const dep = row.getValue("dependencia") as string;
        return (
          <span className={cn(
            "px-2 py-0.5 rounded text-xs font-medium",
            dep === "Estadual" && "bg-primary/10 text-primary",
            dep === "Municipal" && "bg-purple-100 text-purple-700",
            dep === "Federal" && "bg-cyan-100 text-cyan-700"
          )}>
            {dep}
          </span>
        );
      },
      filterFn: (row, id, value) => {
        return value === "all" || row.getValue(id) === value;
      },
    },
    {
      accessorKey: "inec_nivel",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          INEC
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <INECBadge 
          nivel={row.getValue("inec_nivel")} 
          label={row.original.inec}
        />
      ),
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        const nivel = row.getValue(id) as number;
        if (value === "bom") return nivel >= 4;
        if (value === "medio") return nivel === 3;
        if (value === "critico") return nivel <= 2;
        return true;
      },
    },
    {
      accessorKey: "internet",
      header: "Internet",
      cell: ({ row }) => {
        const status = row.getValue("internet") as string;
        const isAdequada = status.toLowerCase().includes("adequada") && !status.toLowerCase().includes("inadequada");
        return (
          <span className={cn(
            "text-xs",
            isAdequada ? "text-success" : "text-destructive"
          )}>
            {isAdequada ? "✓" : "✗"} {status}
          </span>
        );
      },
    },
    {
      accessorKey: "wifi",
      header: "Wi-Fi",
      cell: ({ row }) => {
        const status = row.getValue("wifi") as string;
        const isAdequado = status.toLowerCase().includes("adequado") && !status.toLowerCase().includes("insuficiente");
        return (
          <span className={cn(
            "text-xs",
            isAdequado ? "text-success" : "text-warning"
          )}>
            {isAdequado ? "✓" : "⚠"} {status}
          </span>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  const clearFilters = useCallback(() => {
    setColumnFilters([]);
  }, []);

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          
          {columnFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1 text-muted-foreground"
            >
              <X className="h-3 w-3" />
              Limpar
            </Button>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          Mostrando {table.getFilteredRowModel().rows.length.toLocaleString('pt-BR')} de {data.length.toLocaleString('pt-BR')} escolas
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg animate-fade-in">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Dependência
            </label>
            <Select
              value={(table.getColumn("dependencia")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("dependencia")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Estadual">Estadual</SelectItem>
                <SelectItem value="Municipal">Municipal</SelectItem>
                <SelectItem value="Federal">Federal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Nível INEC
            </label>
            <Select
              value={(table.getColumn("inec_nivel")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("inec_nivel")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="bom">Bom (4-5)</SelectItem>
                <SelectItem value="medio">Médio (3)</SelectItem>
                <SelectItem value="critico">Crítico (0-2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Município
            </label>
            <Input
              placeholder="Filtrar município..."
              value={(table.getColumn("municipio")?.getFilterValue() as string) ?? ""}
              onChange={(e) =>
                table.getColumn("municipio")?.setFilterValue(e.target.value)
              }
              className="h-9"
            />
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Escola
            </label>
            <Input
              placeholder="Filtrar por nome..."
              value={(table.getColumn("escola")?.getFilterValue() as string) ?? ""}
              onChange={(e) =>
                table.getColumn("escola")?.setFilterValue(e.target.value)
              }
              className="h-9"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-xs font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => onRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Nenhuma escola encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Itens por página:</span>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[25, 50, 100, 200].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-muted-foreground px-3">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
