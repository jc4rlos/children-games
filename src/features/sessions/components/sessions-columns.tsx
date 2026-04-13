import { Badge, Button } from "@boilerplate/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { LogOut, PackageSearch, ShoppingCart } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import { ChildAvatar } from "@/features/children/components/child-avatar";
import type { Child } from "@/features/children/data/schema";
import { cn } from "@/lib/utils";
import {
  calculateAge,
  formatElapsed,
  type PlaySession,
  type SessionStatus,
  sessionStatusLabels,
} from "../data/schema";
import { SessionTimer } from "./session-close-dialog";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    value,
  );

const statusBadgeVariant: Record<
  SessionStatus,
  "outline" | "destructive" | "secondary"
> = {
  ACTIVE: "outline",
  CLOSED: "destructive",
  FREE: "secondary",
};

const statusBadgeClass: Record<SessionStatus, string> = {
  ACTIVE:
    "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900/50",
  CLOSED:
    "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/50",
  FREE: "bg-violet-100 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/50 dark:text-violet-300 dark:hover:bg-violet-900/50",
};

const toChildCompat = (session: PlaySession): Child => ({
  id: session.childId,
  guardianId: 0,
  branchId: session.branchId,
  fullName: session.childName,
  gender: session.childGender,
  avatar: session.childAvatar,
  birthDate: session.childBirthDate,
  code: session.childCode,
  notes: null,
  isActive: true,
});

export const createSessionColumns = (
  onClose: (session: PlaySession) => void,
  onAddConsumption: (session: PlaySession) => void,
  onViewCart: (session: PlaySession) => void,
): ColumnDef<PlaySession>[] => [
  {
    id: "child",
    header: "Niño",
    cell: ({ row }) => {
      const s = row.original;
      const age = calculateAge(s.childBirthDate);
      const isGirl = s.childGender === "FEMALE";
      return (
        <div className="flex items-center gap-3">
          <ChildAvatar child={toChildCompat(s)} size="md" />
          <div className="flex flex-col">
            <span className="leading-tight font-medium">{s.childName}</span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>
                {age} {age === 1 ? "año" : "años"}
              </span>
              <span>·</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-medium",
                  isGirl
                    ? "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
                )}
              >
                {isGirl ? "Niña" : "Niño"}
              </span>
            </div>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "checkIn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entrada" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{formatTime(row.getValue("checkIn"))}</span>
    ),
  },
  {
    accessorKey: "checkOut",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salida" />
    ),
    cell: ({ row }) => {
      const checkOut = row.getValue("checkOut") as string | null;
      const status = row.getValue("status") as SessionStatus;

      if (status === "ACTIVE") {
        const scheduled = row.original.scheduledCheckout;
        return (
          <span className="text-sm text-muted-foreground">
            {scheduled ? formatTime(scheduled) : "—"}
          </span>
        );
      }

      return (
        <span className="text-sm text-muted-foreground">
          {checkOut ? formatTime(checkOut) : "—"}
        </span>
      );
    },
  },
  {
    id: "elapsed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tiempo restante" />
    ),
    cell: ({ row }) => {
      const s = row.original;
      if (s.status === "ACTIVE") {
        return (
          <SessionTimer
            checkIn={s.checkIn}
            scheduledCheckout={s.scheduledCheckout}
            pricePerHour={s.pricePerHour}
            minimumCharge={s.minimumCharge}
            showCost
          />
        );
      }
      const minutes = s.minutesPlayed;
      if (minutes == null)
        return <span className="text-sm text-muted-foreground">—</span>;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-sm tabular-nums">
            {formatElapsed(minutes * 60)}
          </span>
          {s.totalAmount != null && (
            <span className="font-mono text-xs font-medium text-muted-foreground">
              {formatCurrency(s.totalAmount)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "sessionType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const s = row.original;
      if (s.isFreeSession) {
        return (
          <Badge
            variant="secondary"
            className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-900"
          >
            <span>🎁</span> Gratuita
          </Badge>
        );
      }
      if (s.couponCode) {
        return (
          <Badge
            variant="outline"
            className="gap-1 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300"
          >
            🎟️ {s.couponCode}
          </Badge>
        );
      }
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Regular
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as SessionStatus;
      return (
        <Badge
          variant={statusBadgeVariant[status]}
          className={cn("rounded-full", statusBadgeClass[status])}
        >
          {sessionStatusLabels[status]}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const s = row.original;
      if (s.status !== "ACTIVE") return null;
      return (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1"
            onClick={() => onAddConsumption(s)}
          >
            <PackageSearch size={13} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="relative h-8 gap-1"
            onClick={() => onViewCart(s)}
          >
            <ShoppingCart size={13} />

            {s.consumptionsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-bold text-white">
                {s.consumptionsCount}
              </span>
            )}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 gap-1"
            onClick={() => onClose(s)}
          >
            <LogOut size={13} />
            Finalizar
          </Button>
        </div>
      );
    },
    meta: { className: "w-72" },
  },
];
