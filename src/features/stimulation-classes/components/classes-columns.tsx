import { Button, Checkbox } from "@boilerplate/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import { LongText } from "@/components/long-text";
import { cn } from "@/lib/utils";
import { classDayLabels, type StimulationClass } from "../data/schema";
import { ClassEnrollmentCell } from "./class-enrollment-cell";
import { ClassRowActions } from "./class-row-actions";

export const createClassColumns = (
  onDelete: (cls: StimulationClass) => void,
  enrolledCounts: Map<number, number>,
  navigate: (opts: { to: string; params: Record<string, string> }) => void,
): ColumnDef<StimulationClass>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
        className="translate-y-0.5"
      />
    ),
    meta: { className: cn("max-md:sticky start-0 z-10 rounded-tl-[inherit]") },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      const cls = row.original;
      return (
        <div className="ps-3">
          <p className="font-medium">{cls.name}</p>
          {cls.description && (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {cls.description}
            </p>
          )}
        </div>
      );
    },
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none",
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: "branchName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sucursal" />
    ),
    cell: ({ row }) => (
      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
        {row.getValue("branchName")}
      </span>
    ),
  },
  {
    accessorKey: "teacherName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Maestro" />
    ),
    cell: ({ row }) => {
      const teacher = row.getValue("teacherName") as string | null;
      return (
        <span className="text-sm text-muted-foreground">
          {teacher ?? "Sin maestro"}
        </span>
      );
    },
  },
  {
    id: "schedule",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Horario" />
    ),
    cell: ({ row }) => {
      const cls = row.original;
      const days = cls.daysOfWeek.map((d) => classDayLabels[d]).join(", ");
      return (
        <span className="text-sm">
          {days} · {cls.startTime} - {cls.endTime}
        </span>
      );
    },
  },
  {
    id: "ageRange",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Edad" />
    ),
    cell: ({ row }) => {
      const cls = row.original;
      return (
        <span className="text-sm text-muted-foreground">
          {cls.ageMinMonths} - {cls.ageMaxMonths} meses
        </span>
      );
    },
  },
  {
    id: "capacity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacidad" />
    ),
    cell: ({ row }) => {
      const cls = row.original;
      const enrolled = enrolledCounts.get(cls.id) ?? 0;
      const isFull = enrolled >= cls.capacity;
      return (
        <span
          className={cn(
            "text-sm font-medium",
            isFull ? "text-destructive" : "text-foreground",
          )}
        >
          {enrolled}/{cls.capacity}
        </span>
      );
    },
  },

  {
    accessorKey: "isActive",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return isActive ? (
        <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
          <CheckCircle size={15} />
          Activa
        </span>
      ) : (
        <span className="flex items-center gap-1 text-muted-foreground">
          <XCircle size={15} />
          Inactiva
        </span>
      );
    },
    filterFn: (row, id, value) => value.includes(String(row.getValue(id))),
  },
  {
    id: "enroll",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inscripción" />
    ),
    cell: ({ row }) => {
      const cls = row.original;
      const enrolled = enrolledCounts.get(cls.id) ?? 0;
      return <ClassEnrollmentCell cls={cls} enrolledCount={enrolled} />;
    },
    enableSorting: false,
  },

  {
    id: "view-detail",
    header: "Ver detalle",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        className="gap-1"
        onClick={() =>
          navigate({
            to: "/stimulation-classes/$classId",
            params: { classId: String(row.original.id) },
          })
        }
      >
        <Eye size={14} />
        Ver
      </Button>
    ),
    meta: { className: "w-28" },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ClassRowActions cls={row.original} onDelete={onDelete} />
    ),
    meta: { className: "w-10" },
  },
];

export { LongText };
