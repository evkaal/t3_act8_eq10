import React, { useState, useMemo, useEffect } from "react";
import {
  Droplets,
  Eye,
  EyeOff,
  Shield,
  ChevronRight,
  LayoutDashboard,
  FlaskConical,
  Network,
  TriangleAlert,
  Bell,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldCheck,
  SlidersHorizontal,
  Download,
  AlertTriangle,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Loader2,
} from "lucide-react";

type View = "login" | "dashboard";
type NavId = "dashboard" | "inventario" | "red" | "alertas";
type BloodType = "A+" | "A−" | "B+" | "B−" | "O+" | "O−" | "AB+" | "AB−";
type Status = "Disponible" | "En Tránsito" | "Cuarentena";
type SortKey = "folio" | "bloodType" | "volume" | "expiry" | "status";
type SortDir = "asc" | "desc";
type FilterKey = "all" | "expiring" | "quarantine" | BloodType;

interface UserData {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  token: string;
}

interface BloodUnit {
  id: number;
  folio: string;
  bloodType: BloodType;
  volume: number;
  expiry: Date;
  status: Status;
  hospital: string;
}

const TODAY = new Date(2026, 6, 14);
const d = (days: number) => new Date(TODAY.getTime() + days * 86_400_000);

const RAW_DATA: BloodUnit[] = [
  {
    id: 1,
    folio: "BLD-2026-00147",
    bloodType: "O+",
    volume: 450,
    expiry: d(3),
    status: "Disponible",
    hospital: "H. General del Norte",
  },
  {
    id: 2,
    folio: "BLD-2026-00148",
    bloodType: "A+",
    volume: 350,
    expiry: d(18),
    status: "Disponible",
    hospital: "H. Civil Guadalajara",
  },
  {
    id: 3,
    folio: "BLD-2026-00149",
    bloodType: "B−",
    volume: 500,
    expiry: d(5),
    status: "En Tránsito",
    hospital: "H. IMSS Monterrey",
  },
  {
    id: 4,
    folio: "BLD-2026-00150",
    bloodType: "AB+",
    volume: 450,
    expiry: d(22),
    status: "Cuarentena",
    hospital: "H. Ángeles Puebla",
  },
];

const BLOOD_COLORS: Record<BloodType, { bg: string; text: string }> = {
  "O+": { bg: "#FEF2F2", text: "#B91C1C" },
  "O−": { bg: "#FFF7ED", text: "#C2410C" },
  "A+": { bg: "#EFF6FF", text: "#1D4ED8" },
  "A−": { bg: "#EEF2FF", text: "#4338CA" },
  "B+": { bg: "#F0FDF4", text: "#15803D" },
  "B−": { bg: "#ECFDF5", text: "#065F46" },
  "AB+": { bg: "#FDF4FF", text: "#7E22CE" },
  "AB−": { bg: "#FAF5FF", text: "#6B21A8" },
};

const STATUS_META: Record<Status, { bg: string; text: string; dot: string }> = {
  Disponible: { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  "En Tránsito": { bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
  Cuarentena: { bg: "#FFF1F2", text: "#BE123C", dot: "#FB7185" },
};

const TABLE_FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "expiring", label: "Próximos a Caducar" },
  { key: "quarantine", label: "En Cuarentena" },
  { key: "O+", label: "O+" },
  { key: "O−", label: "O−" },
  { key: "A+", label: "A+" },
  { key: "A−", label: "A−" },
  { key: "B+", label: "B+" },
  { key: "B−", label: "B−" },
  { key: "AB+", label: "AB+" },
  { key: "AB−", label: "AB−" },
];

const NAV_ITEMS: {
  id: NavId;
  label: string;
  icon: React.ElementType;
  badge?: number;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "inventario", label: "Inventario Inteligente", icon: FlaskConical },
  { id: "red", label: "Red de Hospitales", icon: Network },
  { id: "alertas", label: "Alertas de Escasez", icon: TriangleAlert, badge: 3 },
];

const KPI_CARDS = [
  {
    label: "Unidades Disponibles",
    value: "1,847",
    delta: "+4.2%",
    up: true,
    sub: "vs. semana anterior",
    color: "#15803D",
    bgDot: "#DCFCE7",
  },
  {
    label: "En Tránsito",
    value: "312",
    delta: "+11%",
    up: true,
    sub: "6 hospitales activos",
    color: "#C2410C",
    bgDot: "#FEF3C7",
  },
  {
    label: "Próximos a Caducar",
    value: "38",
    delta: "−7 días",
    up: false,
    sub: "ventana crítica",
    color: "#BE123C",
    bgDot: "#FFE4E6",
  },
  {
    label: "Hospitales Conectados",
    value: "147",
    delta: "100%",
    up: true,
    sub: "todos en línea",
    color: "#1D4ED8",
    bgDot: "#EFF6FF",
  },
];

const ALERTS_DATA = [
  {
    type: "critical",
    label: "O− por debajo de mínimo",
    hospital: "H. General Norte",
    time: "Hace 12 min",
  },
  {
    type: "warning",
    label: "AB+ caduca en 48 h",
    hospital: "H. Civil Guadalajara",
    time: "Hace 35 min",
  },
  {
    type: "warning",
    label: "Stock B− bajo",
    hospital: "IMSS CMN Siglo XXI",
    time: "Hace 1 h",
  },
];

function daysUntil(date: Date) {
  return Math.round((date.getTime() - TODAY.getTime()) / 86_400_000);
}
function fmtDate(date: Date) {
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PlaceholderSection({
  title,
  icon: Icon,
}: {
  title: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-24">
      <div className="w-14 h-14 rounded-2xl bg-[#F2F4F8] border border-[#E8EBF0] flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#B0B8C4]" />
      </div>
      <div>
        <div className="text-[15px] font-semibold text-[#1B2333]">{title}</div>
        <div className="text-[13px] text-[#9CA3AF] mt-1">
          Módulo en construcción
        </div>
      </div>
    </div>
  );
}

function InventoryTable() {
  const [inventoryData, setInventoryData] = useState<BloodUnit[]>([]);
  const [loadingApi, setLoadingApi] = useState(true);

  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("expiry");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    async function fetchBloodData() {
      try {
        const response = await fetch(
          "https://api.data.gov.my/data-catalogue?id=blood_donations&limit=28",
        );
        if (!response.ok) throw new Error("Error en la red");
        const result = await response.json();

        const mappedData: BloodUnit[] = result.map((item: any, i: number) => {
          const types: BloodType[] = [
            "A+",
            "A−",
            "B+",
            "B−",
            "O+",
            "O−",
            "AB+",
            "AB−",
          ];
          const statuses: Status[] = [
            "Disponible",
            "En Tránsito",
            "Cuarentena",
          ];

          return {
            id: i + 1,
            folio: `BLD-MY-${item.date ? item.date.substring(0, 4) : "2026"}-${1000 + i}`,
            bloodType: types[i % types.length],
            volume: 350 + (item.daily % 150) || 450,
            expiry: d((i % 15) - 2),
            status: statuses[i % statuses.length],
            hospital: item.state
              ? `Hospital ${item.state}`
              : "H. General Nacional",
          };
        });

        setInventoryData(mappedData);
      } catch (error) {
        console.error("Error consumiendo la API:", error);
        setInventoryData(RAW_DATA); 
      } finally {
        setLoadingApi(false);
      }
    }
    fetchBloodData();
  }, []);

  const filtered = useMemo(() => {
    let rows = inventoryData;
    if (filter === "expiring")
      rows = rows.filter((r) => daysUntil(r.expiry) <= 7);
    else if (filter === "quarantine")
      rows = rows.filter((r) => r.status === "Cuarentena");
    else if (filter !== "all")
      rows = rows.filter((r) => r.bloodType === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.folio.toLowerCase().includes(q) ||
          r.hospital.toLowerCase().includes(q) ||
          r.bloodType.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [filter, search, inventoryData]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        let cmp = 0;
        if (sortKey === "folio") cmp = a.folio.localeCompare(b.folio);
        if (sortKey === "bloodType")
          cmp = a.bloodType.localeCompare(b.bloodType);
        if (sortKey === "volume") cmp = a.volume - b.volume;
        if (sortKey === "expiry") cmp = a.expiry.getTime() - b.expiry.getTime();
        if (sortKey === "status") cmp = a.status.localeCompare(b.status);
        return sortDir === "asc" ? cmp : -cmp;
      }),
    [filtered, sortKey, sortDir],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const pageNums = useMemo(() => {
    const nums: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) nums.push(i);
    } else {
      nums.push(1);
      if (safePage > 3) nums.push("…");
      for (
        let i = Math.max(2, safePage - 1);
        i <= Math.min(totalPages - 1, safePage + 1);
        i++
      )
        nums.push(i);
      if (safePage < totalPages - 2) nums.push("…");
      nums.push(totalPages);
    }
    return nums;
  }, [totalPages, safePage]);

  const SortIcons = ({ col }: { col: SortKey }) => (
    <span className="inline-flex flex-col ml-1.5 opacity-40">
      <ChevronUp
        className={`w-2.5 h-2.5 -mb-0.5 ${sortKey === col && sortDir === "asc" ? "opacity-100 text-[#C1121F]" : ""}`}
      />
      <ChevronDown
        className={`w-2.5 h-2.5        ${sortKey === col && sortDir === "desc" ? "opacity-100 text-[#C1121F]" : ""}`}
      />
    </span>
  );

  const expiringSoon = inventoryData.filter(
    (r) => daysUntil(r.expiry) <= 7,
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-[#E8EBF0] overflow-hidden shadow-sm">
      <div className="px-6 pt-6 pb-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[#1B2333] text-[17px] font-semibold tracking-tight">
              Inventario de Sangre Activo
            </h2>
            <p className="text-[#9CA3AF] text-[12px] mt-0.5">
              {loadingApi
                ? "Conectando con API..."
                : `${filtered.length} registros · actualizado hoy 08:42`}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {expiringSoon > 0 && !loadingApi && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap">
                <AlertTriangle className="w-3 h-3" /> {expiringSoon} caducan
                pronto
              </div>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B0B8C4]" />
              <input
                type="search"
                placeholder="Buscar folio…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-3 py-2 text-[12px] text-[#1B2333] placeholder:text-[#B0B8C4] border border-[#D4D8E1] rounded-xl bg-[#F9FAFB] outline-none focus:border-[#1B2333] transition-all w-44"
              />
            </div>
            <button className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#1B2333] text-[12px] font-medium border border-[#D4D8E1] bg-white px-3 py-2 rounded-xl transition-colors">
              <Download className="w-3.5 h-3.5" /> Exportar
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#B0B8C4] flex-shrink-0" />
          {TABLE_FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => {
                  setFilter(f.key);
                  setPage(1);
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-100 border"
                style={
                  active
                    ? {
                        background: "#C1121F",
                        color: "#fff",
                        borderColor: "#C1121F",
                      }
                    : {
                        background: "#F2F4F8",
                        color: "#6B7280",
                        borderColor: "transparent",
                      }
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <div className="h-px bg-[#E8EBF0] mt-4" />
      </div>

      <div className="overflow-x-auto relative min-h-[300px]">
        {loadingApi && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 animate-spin text-[#C1121F] mb-3" />
            <span className="text-sm font-semibold text-[#1B2333]">
              Obteniendo datos desde API externa...
            </span>
          </div>
        )}

        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#F9FAFB]">
              {(
                [
                  { key: "folio", label: "Folio Único" },
                  { key: "bloodType", label: "Tipo de Sangre" },
                  { key: "volume", label: "Volumen (ml)" },
                  { key: "expiry", label: "Caducidad Estimada" },
                  { key: "status", label: "Estatus de Trazabilidad" },
                ] as { key: SortKey; label: string }[]
              ).map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-5 py-3.5 text-left font-semibold text-[#6B7280] cursor-pointer select-none whitespace-nowrap hover:text-[#1B2333] transition-colors border-b border-[#E8EBF0] text-[11px] uppercase tracking-wide"
                >
                  {col.label}
                  <SortIcons col={col.key} />
                </th>
              ))}
              <th className="px-5 py-3.5 border-b border-[#E8EBF0] w-10" />
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && !loadingApi ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-16 text-[#B0B8C4] text-[13px]"
                >
                  Sin registros para el filtro seleccionado
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                const days = daysUntil(row.expiry);
                const critical = days <= 3;
                const warning = days > 3 && days <= 7;
                const bColor = BLOOD_COLORS[row.bloodType];
                const sMeta = STATUS_META[row.status];
                return (
                  <tr
                    key={row.id}
                    className="border-b border-[#F2F4F8] hover:bg-[#FAFBFC] transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <span className="font-mono text-[11px] bg-[#F2F4F8] px-2 py-0.5 rounded-md text-[#1B2333] font-medium">
                        {row.folio}
                      </span>
                      <div className="text-[11px] text-[#B0B8C4] mt-1">
                        {row.hospital}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-[13px] font-bold"
                        style={{ background: bColor.bg, color: bColor.text }}
                      >
                        {row.bloodType}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 rounded-full bg-[#E8EBF0] w-14 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#1B2333]"
                            style={{
                              width: `${((row.volume - 350) / 150) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-[#1B2333] font-medium">
                          {row.volume}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div
                        className={`font-medium text-[13px] ${critical ? "text-[#BE123C]" : warning ? "text-amber-600" : "text-[#1B2333]"}`}
                      >
                        {fmtDate(row.expiry)}
                      </div>
                      <div
                        className={`text-[11px] mt-0.5 font-semibold ${critical ? "text-[#C1121F]" : warning ? "text-amber-500" : "text-[#9CA3AF]"}`}
                      >
                        {critical
                          ? `⚠ Caduca en ${days} día${days === 1 ? "" : "s"}`
                          : warning
                            ? `↑ En ${days} días`
                            : `En ${days} días`}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap"
                        style={{ background: sMeta.bg, color: sMeta.text }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: sMeta.dot }}
                        />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[#9CA3AF] hover:text-[#1B2333] p-1 rounded-md hover:bg-[#F2F4F8]">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 border-t border-[#E8EBF0] bg-[#F9FAFB]">
        <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
          <span>Mostrar</span>
          <div className="flex gap-1">
            {[5, 10, 20].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setPageSize(n);
                  setPage(1);
                }}
                className="w-8 h-8 rounded-lg text-[12px] font-semibold border transition-all"
                style={
                  pageSize === n
                    ? {
                        background: "#1B2333",
                        color: "#fff",
                        borderColor: "#1B2333",
                      }
                    : {
                        background: "white",
                        color: "#6B7280",
                        borderColor: "#D4D8E1",
                      }
                }
              >
                {n}
              </button>
            ))}
          </div>
          <span>por página</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-[#9CA3AF] mr-1">
            {(safePage - 1) * pageSize + 1}–
            {Math.min(safePage * pageSize, sorted.length)} de {sorted.length}
          </span>
          {[
            {
              icon: ChevronsLeft,
              action: () => setPage(1),
              disabled: safePage === 1,
            },
            {
              icon: ChevronLeft,
              action: () => setPage((p) => p - 1),
              disabled: safePage === 1,
            },
          ].map(({ icon: Icon, action, disabled }, i) => (
            <button
              key={i}
              disabled={disabled}
              onClick={action}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D4D8E1] bg-white text-[#6B7280] hover:border-[#1B2333] hover:text-[#1B2333] disabled:opacity-30 transition-all"
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
          {pageNums.map((n, i) =>
            n === "…" ? (
              <span
                key={`e${i}`}
                className="w-8 text-center text-[#B0B8C4] text-[12px]"
              >
                …
              </span>
            ) : (
              <button
                key={n}
                onClick={() => setPage(n as number)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-semibold border transition-all"
                style={
                  safePage === n
                    ? {
                        background: "#C1121F",
                        color: "#fff",
                        borderColor: "#C1121F",
                      }
                    : {
                        background: "white",
                        color: "#6B7280",
                        borderColor: "#D4D8E1",
                      }
                }
              >
                {n}
              </button>
            ),
          )}
          {[
            {
              icon: ChevronRight,
              action: () => setPage((p) => p + 1),
              disabled: safePage === totalPages,
            },
            {
              icon: ChevronsRight,
              action: () => setPage(totalPages),
              disabled: safePage === totalPages,
            },
          ].map(({ icon: Icon, action, disabled }, i) => (
            <button
              key={i}
              disabled={disabled}
              onClick={action}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D4D8E1] bg-white text-[#6B7280] hover:border-[#1B2333] hover:text-[#1B2333] disabled:opacity-30 transition-all"
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardHome({ onGoInventory }: { onGoInventory: () => void }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[#1B2333] text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-[#9CA3AF] text-[13px] mt-1">
          Resumen operativo · actualizado hoy, 08:42 hrs
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {KPI_CARDS.map((k) => (
          <div
            key={k.label}
            className="bg-white rounded-2xl border border-[#E8EBF0] px-5 py-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide leading-tight">
                {k.label}
              </span>
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: k.bgDot }}
              >
                {k.up ? (
                  <TrendingUp
                    className="w-3.5 h-3.5"
                    style={{ color: k.color }}
                  />
                ) : (
                  <TrendingDown
                    className="w-3.5 h-3.5"
                    style={{ color: k.color }}
                  />
                )}
              </span>
            </div>
            <div className="text-[28px] font-semibold text-[#1B2333] leading-none tracking-tight">
              {k.value}
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-[11px] font-semibold"
                style={{ color: k.color }}
              >
                {k.delta}
              </span>
              <span className="text-[11px] text-[#B0B8C4]">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E8EBF0] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#F2F4F8] flex items-center justify-between">
            <div>
              <div className="text-[15px] font-semibold text-[#1B2333] tracking-tight">
                Inventario Rápido
              </div>
              <div className="text-[12px] text-[#9CA3AF] mt-0.5">
                Ve al panel completo para estadísticas en vivo
              </div>
            </div>
            <button
              onClick={onGoInventory}
              className="text-[12px] font-semibold text-[#C1121F] flex items-center gap-1 hover:underline"
            >
              Ir a Inventario <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-[#F9FAFB]">
                  {[
                    "Folio Único",
                    "Tipo",
                    "Volumen",
                    "Caducidad",
                    "Estatus",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase border-b"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RAW_DATA.slice(0, 5).map((row) => {
                  const bC = BLOOD_COLORS[row.bloodType];
                  const sM = STATUS_META[row.status];
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-[#F2F4F8] hover:bg-[#FAFBFC]"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[10px] bg-[#F2F4F8] px-1.5 py-0.5 rounded text-[#1B2333]">
                          {row.folio}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[11px] font-bold"
                          style={{ background: bC.bg, color: bC.text }}
                        >
                          {row.bloodType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#1B2333] font-medium">
                        {row.volume} ml
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-[#1B2333]">
                          {fmtDate(row.expiry)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-semibold"
                          style={{ background: sM.bg, color: sM.text }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: sM.dot }}
                          />
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-[#E8EBF0] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F2F4F8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TriangleAlert className="w-4 h-4 text-[#C1121F]" />
                <span className="text-[14px] font-semibold text-[#1B2333]">
                  Alertas Activas
                </span>
              </div>
              <span className="text-[10px] font-bold bg-[#C1121F] text-white px-2 py-0.5 rounded-md">
                3
              </span>
            </div>
            <div className="divide-y divide-[#F2F4F8]">
              {ALERTS_DATA.map((a, i) => (
                <div key={i} className="px-5 py-3.5 flex gap-3 items-start">
                  <span
                    className="mt-0.5 w-2 h-2 rounded-full"
                    style={{
                      background: a.type === "critical" ? "#C1121F" : "#F97316",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-[#1B2333] truncate">
                      {a.label}
                    </div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5">
                      {a.hospital}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#B0B8C4]">
                    <Clock className="w-3 h-3" />
                    {a.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8EBF0] px-5 py-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span className="text-[14px] font-semibold text-[#1B2333]">
                Estado del Sistema
              </span>
            </div>
            <div className="space-y-3">
              {[
                { name: "API de Trazabilidad", ok: true },
                { name: "Sincronización IMSS", ok: true },
                { name: "Módulo de Alertas", ok: true },
                { name: "Respaldo en Nube", ok: false },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="text-[12px] text-[#6B7280]">{s.name}</span>
                  <span
                    className="flex items-center gap-1.5 text-[11px] font-semibold"
                    style={{ color: s.ok ? "#15803D" : "#C2410C" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: s.ok ? "#22C55E" : "#F97316" }}
                    />
                    {s.ok ? "Operativo" : "Degradado"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (user: UserData) => void }) {
  const [showPwd, setShowPwd] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Por favor, ingresa tu usuario y contraseña.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
          expiresInMins: 60,
        }),
      });

      if (!response.ok) {
        throw new Error("Usuario o contraseña incorrectos");
      }

      const data: UserData = await response.json();
      onLogin(data);
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  const stats = [
    { label: "Hospitales conectados", value: "147" },
    { label: "Donaciones trazadas", value: "2.4M" },
    { label: "Unidades en stock", value: "18,320" },
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <aside className="hidden lg:flex w-[42%] bg-[#1B2333] flex-col p-14 relative overflow-hidden select-none">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 48px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 48px)`,
          }}
        />
        <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full bg-[#C1121F] opacity-[0.07] pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C1121F] flex items-center justify-center flex-shrink-0 shadow-lg">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-[17px] leading-none tracking-tight"></div>
            <div className="text-white/35 text-[10px] mt-1 tracking-[0.15em] uppercase font-medium">
              Trazabilidad
            </div>
          </div>
        </div>
        <div className="relative mt-auto mb-16">
          <div className="w-8 h-[2px] bg-[#C1121F] mb-8 rounded-full" />
          <h1 className="text-white text-[28px] font-semibold leading-[1.35] tracking-tight mb-4">
            Red Nacional de
            <br />
            Bancos de Sangre
          </h1>
          <p className="text-white/45 text-[13px] leading-relaxed max-w-[280px]">
            Sistema integrado de trazabilidad para donaciones, análisis y
            distribución de hemoderivados en la red hospitalaria.
          </p>
        </div>
        <div className="relative border-t border-white/10 pt-8 grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-white text-xl font-semibold tracking-tight">
                {s.value}
              </div>
              <div className="text-white/35 text-[11px] mt-1.5 leading-tight">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </aside>
      <main className="flex-1 bg-[#F2F4F8] flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-10">
            <div className="flex items-center gap-1.5 text-[#C1121F] text-[10px] font-semibold tracking-[0.18em] uppercase mb-4">
              <Shield className="w-3 h-3" /> Acceso Institucional
            </div>
            <h2 className="text-[#1B2333] text-[28px] font-semibold leading-[1.3] tracking-tight">
              Acceso a Red
              <br />
              de Hospitales
            </h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="mb-5 p-3.5 bg-[#FFF1F2] border border-[#FECDD3] rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#BE123C] flex-shrink-0 mt-0.5" />
                <span className="text-[13px] font-medium text-[#BE123C]">
                  {error}
                </span>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-[#1B2333] text-[13px] font-semibold mb-2 tracking-tight">
                Usuario (API DummyJSON)
              </label>
              <div className="flex items-center bg-white rounded-xl border border-[#D4D8E1]">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ej. emilys"
                  className="flex-1 px-4 py-[14px] text-[#1B2333] placeholder:text-[#B0B8C4] bg-transparent outline-none text-[14px] rounded-xl"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[#1B2333] text-[13px] font-semibold mb-2 tracking-tight">
                Contraseña
              </label>
              <div className="flex items-center bg-white rounded-xl border border-[#D4D8E1]">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="flex-1 px-4 py-[14px] text-[#1B2333] placeholder:text-[#B0B8C4] bg-transparent outline-none text-[14px] rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="pr-4 text-[#9CA3AF] hover:text-[#6B7280]"
                >
                  {showPwd ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-[#C1121F] hover:bg-[#A80F1A] disabled:opacity-60 text-white py-[15px] px-6 rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                "Verificando credenciales…"
              ) : (
                <>
                  {" "}
                  Entrar al Sistema <ChevronRight className="w-4 h-4" />{" "}
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

function DashboardShell({
  user,
  onLogout,
}: {
  user: UserData;
  onLogout: () => void;
}) {
  const [active, setActive] = useState<NavId>("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const pageTitle =
    NAV_ITEMS.find((n) => n.id === active)?.label ?? "Dashboard";

  return (
    <div
      className="flex h-screen bg-[#F2F4F8] overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <aside className="w-[240px] flex-shrink-0 flex flex-col bg-[#1B2333] transition-all duration-200">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.07]">
          <div className="w-9 h-9 rounded-xl bg-[#C1121F] flex items-center justify-center flex-shrink-0">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-[15px] leading-none">
              Sangre
            </div>
            <div className="text-white/35 text-[10px] tracking-[0.14em] uppercase mt-1">
              Sangre
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <div className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-3">
            Módulos
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all relative"
                style={
                  isActive
                    ? { background: "rgba(193,18,31,0.15)", color: "#fff" }
                    : { color: "rgba(255,255,255,0.5)" }
                }
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#C1121F]" />
                )}
                <Icon
                  className="w-[18px] h-[18px]"
                  style={{ color: isActive ? "#C1121F" : undefined }}
                />
                <span className="text-[13px] font-medium flex-1">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-bold bg-[#C1121F] text-white px-1.5 py-0.5 rounded-md leading-none">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/[0.07] space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all text-[13px] font-medium">
            <Settings className="w-[18px] h-[18px]" />
            <span>Configuración</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-[#C1121F] hover:bg-[rgba(193,18,31,0.08)] transition-all text-[13px] font-medium"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#E8EBF0] flex items-center gap-4 px-6 z-20">
          <div className="flex items-center gap-2 text-[13px] text-[#9CA3AF]">
            <span className="text-[#1B2333] font-medium">{pageTitle}</span>
          </div>
          <div className="flex-1 max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B0B8C4]" />
            <input
              type="search"
              placeholder="Buscar folio, hospital..."
              className="w-full pl-9 pr-4 py-2 text-[13px] bg-[#F2F4F8] rounded-xl outline-none"
            />
          </div>
          <div className="flex-1" />
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F2F4F8] text-[#6B7280]">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C1121F] border-2 border-white" />
          </button>
          <div className="w-px h-6 bg-[#E8EBF0]" />

          <div className="relative">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-[#F2F4F8] transition-colors"
            >
              <img
                src={user.image}
                alt={user.firstName}
                className="w-8 h-8 rounded-full bg-[#1B2333] border border-[#D4D8E1]"
              />
              <div className="text-left hidden sm:block">
                <div className="text-[13px] font-semibold text-[#1B2333] leading-none">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-[11px] text-[#9CA3AF] mt-0.5">
                  Administrador de Red
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-xl border border-[#E8EBF0] shadow-lg py-1.5 z-50">
                <div className="px-4 py-3 border-b border-[#F2F4F8]">
                  <div className="text-[13px] font-semibold text-[#1B2333]">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-[11px] text-[#9CA3AF] mt-0.5">
                    {user.email}
                  </div>
                </div>
                <div className="border-t border-[#F2F4F8] mt-1.5 pt-1.5">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-[#BE123C] hover:bg-[#FFF1F2] transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-8 relative">
          {active === "dashboard" && (
            <DashboardHome onGoInventory={() => setActive("inventario")} />
          )}
          {active === "inventario" && <InventoryTable />}
          {active === "red" && (
            <PlaceholderSection title="Red de Hospitales" icon={Network} />
          )}
          {active === "alertas" && (
            <PlaceholderSection
              title="Alertas de Escasez"
              icon={TriangleAlert}
            />
          )}
        </main>
      </div>

      {profileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("login");
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  const handleLogin = (userData: UserData) => {
    setCurrentUser(userData);
    setView("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("login");
  };

  return view === "login" ? (
    <LoginScreen onLogin={handleLogin} />
  ) : (
    <DashboardShell user={currentUser!} onLogout={handleLogout} />
  );
}
