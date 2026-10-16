import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, PackageX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading?: boolean;
  pageSize?: number;
  emptyMessage?: string;
}

export const DataTable = <TData,>({
  columns,
  data,
  isLoading = false,
  pageSize = 5,
  emptyMessage = "Nenhum resultado encontrado.",
}: DataTableProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="border-border bg-card w-full min-w-0 rounded-xl border p-4">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="border-border bg-card/50 flex w-full min-w-0 flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
        <div className="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full">
          <PackageX className="size-7" />
        </div>
        <h3 className="text-foreground mt-4 text-lg font-semibold">
          {emptyMessage}
        </h3>
      </div>
    );
  }

  const pageIndex = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();
  const startIndex = pageIndex * pageSize + 1;
  const endIndex = Math.min((pageIndex + 1) * pageSize, data.length);

  return (
    <div className="border-border bg-card flex w-full min-w-0 flex-col overflow-hidden rounded-xl border shadow-xs">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="border-border bg-card flex w-full min-w-0 flex-col items-center justify-between gap-3 border-t p-4 sm:flex-row">
        <span className="text-muted-foreground text-xs">
          Exibindo <strong className="text-foreground">{startIndex}</strong> a{" "}
          <strong className="text-foreground">{endIndex}</strong> de{" "}
          <strong className="text-foreground">{data.length}</strong> itens
        </span>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 gap-1 text-xs"
          >
            <ChevronLeft className="size-4" />
            Anterior
          </Button>

          <div className="flex max-w-50 items-center gap-1 overflow-x-auto px-1 sm:max-w-none">
            {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
              <Button
                key={page}
                variant={page === pageIndex ? "default" : "ghost"}
                size="sm"
                onClick={() => table.setPageIndex(page)}
                className="size-8 shrink-0 p-0 text-xs font-medium"
              >
                {page + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 gap-1 text-xs"
          >
            Próximo
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
