import { useEffect } from "react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  History,
  Search,
  Star,
  Timer,
  X,
} from "lucide-react";
import { useState } from "react";
import { getAvatarUrl } from "@/features/children/data/avatar-utils";
import { calculateAge } from "@/features/sessions/data/schema";
import { cn } from "@/lib/utils";
import { AttendanceTab } from "./components/attendance-tab";
import { HistoryTab } from "./components/history-tab";
import { SessionTab } from "./components/session-tab";
import { StampsTab } from "./components/stamps-tab";
import {
  useChildByCode,
  useChildrenByGuardian,
  useGuardianByCode,
  usePortalActiveSession,
  usePortalLoyalty,
} from "./hooks/use-parent-portal";

type Tab = "stamps" | "session" | "history" | "attendance";

const route = getRouteApi("/portal");

const TABS: { id: Tab; label: string; icon: typeof Star }[] = [
  { id: "stamps", label: "Sellos", icon: Star },
  { id: "session", label: "Sesión", icon: Timer },
  { id: "history", label: "Historial", icon: History },
  { id: "attendance", label: "Clases", icon: BookOpen },
];

export const ParentPortal = () => {
  const search = route.useSearch();
  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState(search.code ?? "");
  const [activeCode, setActiveCode] = useState(search.code ?? "");
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(
    (search.tab as Tab | undefined) ?? "stamps",
  );

  // Sync input code with URL query param
  useEffect(() => {
    if (search.code) {
      setInputCode(search.code);
      setActiveCode(search.code);
    }
  }, [search.code]);

  const {
    data: child,
    isLoading: childLoading,
    isFetching: childFetching,
  } = useChildByCode(activeCode);
  const {
    data: guardian,
    isLoading: guardianLoading,
    isFetching: guardianFetching,
  } = useGuardianByCode(activeCode && !child ? activeCode : "");
  const { data: guardianChildren, isLoading: childrenLoading } =
    useChildrenByGuardian(guardian?.id ?? null);

  const { data: loyalty, isLoading: loyaltyLoading } = usePortalLoyalty(
    selectedChildId ?? child?.id ?? null,
  );
  const { data: activeSession, isLoading: sessionLoading } =
    usePortalActiveSession(selectedChildId ?? child?.id ?? null);

  const hasSearched = activeCode.length >= 3;
  const isLoading =
    childLoading ||
    childFetching ||
    guardianLoading ||
    guardianFetching ||
    childrenLoading;
  const displayChild =
    selectedChildId !== null && guardianChildren
      ? guardianChildren.find(
          (c: unknown) => (c as { id: number }).id === selectedChildId,
        )
      : child;
  const isInGuardianMode = guardian && !child && !selectedChildId;
  const childNotFound = hasSearched && !isLoading && !child && !guardian;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const code = inputCode.trim().toUpperCase();
    if (!code) return;
    setActiveCode(code);
    setSelectedChildId(null);
    void navigate({ to: "/portal", search: { code, tab: activeTab } });
  };

  const handleClear = () => {
    setInputCode("");
    setActiveCode("");
    setSelectedChildId(null);
    void navigate({ to: "/portal", search: {} });
  };

  const handleSelectChild = (childId: number) => {
    setSelectedChildId(childId);
  };

  const handleBackFromGuardian = () => {
    setSelectedChildId(null);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    void navigate({ to: "/portal", search: { code: activeCode, tab } });
  };

  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      {/* Header */}
      <div className="pt-safe-top sticky top-0 z-10 bg-linear-to-r from-teal-600 to-teal-500 px-4 pb-4 shadow-md">
        <div className="flex items-center gap-2 pt-3">
          {(displayChild || isInGuardianMode) && (
            <button
              type="button"
              onClick={
                selectedChildId !== null ? handleBackFromGuardian : handleClear
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-teal-100 hover:bg-white/20"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <h1 className="flex-1 text-lg font-bold text-white">
            {displayChild
              ? displayChild.fullName
              : isInGuardianMode
                ? `Hijos de ${guardian?.fullName}`
                : "Mi Tarjeta de Juego"}
          </h1>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="mt-3">
          <div className="relative flex items-center rounded-xl bg-white/20 px-3 py-2.5 backdrop-blur-sm">
            <Search size={16} className="mr-2 shrink-0 text-teal-100" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Código del niño o apoderado..."
              className="flex-1 bg-transparent text-sm font-medium text-white placeholder-teal-200 outline-none"
              autoCapitalize="characters"
              maxLength={20}
            />
            {inputCode && (
              <button
                type="button"
                onClick={handleClear}
                className="ml-2 text-teal-200 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
            <button
              type="submit"
              className="ml-2 rounded-lg bg-white/25 px-3 py-1 text-xs font-semibold text-white hover:bg-white/40"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Loading skeleton */}
        {hasSearched && isLoading && (
          <div className="flex flex-col gap-4 p-4">
            <div className="h-24 animate-pulse rounded-2xl bg-muted" />
            <div className="h-48 animate-pulse rounded-2xl bg-muted" />
          </div>
        )}

        {/* Not found */}
        {childNotFound && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="text-5xl">🔍</div>
            <p className="text-lg font-semibold">Código no encontrado</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Verifica que el código{" "}
              <span className="font-mono font-bold">{activeCode}</span> sea
              correcto. Puedes encontrarlo en la tarjeta de tu niño o en tu
              documento como apoderado.
            </p>
          </div>
        )}

        {/* Welcome screen */}
        {!hasSearched && (
          <div className="flex flex-col items-center justify-center gap-5 px-6 py-16 text-center">
            <div className="text-7xl">🎮</div>
            <div>
              <h2 className="text-xl font-bold">Portal de Padres</h2>
              <p className="mt-1 text-muted-foreground">
                Ingresa el código de tu niño o el tuyo como apoderado para ver
                sellos, sesión activa, historial y asistencias.
              </p>
            </div>
            <div className="rounded-2xl border bg-muted/40 p-4 text-left text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">
                ¿Dónde encuentro el código?
              </p>
              <p className="mt-1">
                El código del niño aparece en su tarjeta de registro. Como
                apoderado, tu código aparece en tu documento. Pregunta al
                personal si no los tienes.
              </p>
            </div>
          </div>
        )}

        {/* Guardian selector mode */}
        {isInGuardianMode &&
          !childrenLoading &&
          guardianChildren &&
          (guardianChildren.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="text-5xl">👥</div>
              <p className="text-lg font-semibold text-muted-foreground">
                Sin niños asociados
              </p>
              <p className="text-sm text-muted-foreground">
                No hay niños registrados para este apoderado.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-4">
              <p className="text-sm text-muted-foreground">
                Selecciona un niño para ver sus detalles
              </p>
              {guardianChildren.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectChild(c.id)}
                  className="flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-sm transition-colors hover:bg-muted"
                >
                  <img
                    src={c.avatar ?? getAvatarUrl(c.code, c.gender)}
                    alt={c.fullName}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-teal-200 dark:ring-teal-700"
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-lg font-bold">{c.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {calculateAge(c.birthDate)} años ·{" "}
                      {c.gender === "FEMALE" ? "Niña" : "Niño"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.branchName}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-teal-50 px-2 py-1 font-mono text-xs font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                    {c.code}
                  </span>
                </button>
              ))}
            </div>
          ))}

        {/* Child info + tabs */}
        {displayChild && !childLoading && (
          <>
            {/* Child card */}
            <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-sm">
              <img
                src={
                  displayChild.avatar ??
                  getAvatarUrl(displayChild.code, displayChild.gender)
                }
                alt={displayChild.fullName}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-teal-200 dark:ring-teal-700"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg leading-tight font-bold">
                  {displayChild.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {calculateAge(displayChild.birthDate)} años ·{" "}
                  {displayChild.gender === "FEMALE" ? "Niña" : "Niño"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {displayChild.branchName}
                </p>
              </div>
              <span className="shrink-0 rounded-lg bg-teal-50 px-2 py-1 font-mono text-xs font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                {displayChild.code}
              </span>
            </div>

            {/* Tab content */}
            <div className="mt-2">
              {activeTab === "stamps" && (
                <StampsTab card={loyalty} isLoading={loyaltyLoading} />
              )}
              {activeTab === "session" && (
                <SessionTab
                  session={activeSession}
                  isLoading={sessionLoading}
                />
              )}
              {activeTab === "history" && (
                <HistoryTab childId={displayChild.id} />
              )}
              {activeTab === "attendance" && (
                <AttendanceTab childId={displayChild.id} />
              )}
            </div>
          </>
        )}
      </div>

      {/* Bottom nav — only shown when child is found */}
      {displayChild && (
        <div className="pb-safe-bottom fixed right-0 bottom-0 left-0 z-20 border-t bg-background/95 backdrop-blur-sm">
          <div className="flex">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleTabChange(id)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                  activeTab === id
                    ? "text-teal-600 dark:text-teal-400"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  size={22}
                  className={cn(
                    activeTab === id && "fill-teal-100 dark:fill-teal-900/50",
                  )}
                />
                {label}
                {activeTab === id && (
                  <span className="absolute bottom-0 mx-auto h-0.5 w-8 rounded-full bg-teal-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
