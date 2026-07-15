import { useState } from "react";
import { Droplets, LayoutDashboard, FlaskConical, Network, TriangleAlert, Bell, Search, ChevronDown, Settings, LogOut, TrendingUp, TrendingDown, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import InventoryTable from "../components/InventoryTable.jsx";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "inventario", label: "Inventario Inteligente", icon: FlaskConical },
  { id: "red", label: "Red de Hospitales", icon: Network },
  { id: "alertas", label: "Alertas de Escasez", icon: TriangleAlert, badge: 3 },
];

const KPI_CARDS = [
  { label: "Unidades Disponibles", value: "1,847", delta: "+4.2%", up: true, sub: "vs. semana anterior", color: "#15803D", bgDot: "#DCFCE7" },
  { label: "En Tránsito", value: "312", delta: "+11%", up: true, sub: "6 hospitales activos", color: "#C2410C", bgDot: "#FEF3C7" },
  { label: "Próximos a Caducar", value: "38", delta: "−7 días", up: false, sub: "ventana crítica", color: "#BE123C", bgDot: "#FFE4E6" },
  { label: "Hospitales Conectados", value: "147", delta: "100%", up: true, sub: "todos en línea", color: "#1D4ED8", bgDot: "#EFF6FF" },
];

const ALERTS_DATA = [
  { type: "critical", label: "O− por debajo de mínimo", hospital: "H. General Norte", time: "Hace 12 min" },
  { type: "warning", label: "AB+ caduca en 48 h", hospital: "H. Civil Guadalajara", time: "Hace 35 min" },
  { type: "warning", label: "Stock B− bajo", hospital: "IMSS CMN Siglo XXI", time: "Hace 1 h" },
];

function PlaceholderSection({ title, icon: Icon }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-24">
      <div className="w-14 h-14 rounded-2xl bg-[#F2F4F8] border border-[#E8EBF0] flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#B0B8C4]" />
      </div>
      <div>
        <div className="text-[15px] font-semibold text-[#1B2333]">{title}</div>
        <div className="text-[13px] text-[#9CA3AF] mt-1">Módulo en construcción</div>
      </div>
    </div>
  );
}

function DashboardHome({ onGoInventory }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[#1B2333] text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-[#9CA3AF] text-[13px] mt-1">Resumen operativo · actualizado hoy, 08:42 hrs</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {KPI_CARDS.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-[#E8EBF0] px-5 py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide leading-tight">{k.label}</span>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: k.bgDot }}>
                {k.up ? <TrendingUp className="w-3.5 h-3.5" style={{ color: k.color }} /> : <TrendingDown className="w-3.5 h-3.5" style={{ color: k.color }} />}
              </span>
            </div>
            <div className="text-[28px] font-semibold text-[#1B2333] leading-none tracking-tight">{k.value}</div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold" style={{ color: k.color }}>{k.delta}</span>
              <span className="text-[11px] text-[#B0B8C4]">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E8EBF0] overflow-hidden p-8 text-center text-gray-500">
           <p className="mb-4">Panel de Inventario Rápido</p>
           <button onClick={onGoInventory} className="text-[#C1121F] font-semibold hover:underline flex items-center justify-center w-full gap-1">Ver Tabla Completa <ChevronRight className="w-4 h-4"/></button>
        </div>
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-[#E8EBF0] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F2F4F8] flex items-center justify-between">
              <div className="flex items-center gap-2"><TriangleAlert className="w-4 h-4 text-[#C1121F]" /><span className="text-[14px] font-semibold text-[#1B2333]">Alertas Activas</span></div>
              <span className="text-[10px] font-bold bg-[#C1121F] text-white px-2 py-0.5 rounded-md">3</span>
            </div>
            <div className="divide-y divide-[#F2F4F8]">
              {ALERTS_DATA.map((a, i) => (
                <div key={i} className="px-5 py-3.5 flex gap-3 items-start">
                  <span className="mt-0.5 w-2 h-2 rounded-full" style={{ background: a.type === "critical" ? "#C1121F" : "#F97316" }} />
                  <div className="flex-1 min-w-0"><div className="text-[12px] font-medium text-[#1B2333] truncate">{a.label}</div><div className="text-[11px] text-[#9CA3AF] mt-0.5">{a.hospital}</div></div>
                  <div className="flex items-center gap-1 text-[10px] text-[#B0B8C4]"><Clock className="w-3 h-3" />{a.time}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E8EBF0] px-5 py-5">
            <div className="flex items-center gap-2 mb-4"><ShieldCheck className="w-4 h-4 text-[#15803D]" /><span className="text-[14px] font-semibold text-[#1B2333]">Estado del Sistema</span></div>
            <div className="space-y-3">
              {[{ name: "API de Trazabilidad", ok: true }, { name: "Sincronización IMSS", ok: true }, { name: "Módulo de Alertas", ok: true }, { name: "Respaldo en Nube", ok: false }].map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="text-[12px] text-[#6B7280]">{s.name}</span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: s.ok ? "#15803D" : "#C2410C" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.ok ? "#22C55E" : "#F97316" }} />{s.ok ? "Operativo" : "Degradado"}
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

export default function Dashboard({ user, onLogout }) {
  const [active, setActive] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const pageTitle = NAV_ITEMS.find((n) => n.id === active)?.label ?? "Dashboard";

  return (
    <div className="flex h-screen bg-[#F2F4F8] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <aside className="w-[240px] flex-shrink-0 flex flex-col bg-[#1B2333] transition-all duration-200">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.07]">
          <div className="w-9 h-9 rounded-xl bg-[#C1121F] flex items-center justify-center flex-shrink-0">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-[15px] leading-none">Sangre</div>
            <div className="text-white/35 text-[10px] tracking-[0.14em] uppercase mt-1">Sangre</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <div className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-3">Módulos</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => setActive(item.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all relative" style={isActive ? { background: "rgba(193,18,31,0.15)", color: "#fff" } : { color: "rgba(255,255,255,0.5)" }}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#C1121F]" />}
                <Icon className="w-[18px] h-[18px]" style={{ color: isActive ? "#C1121F" : undefined }} />
                <span className="text-[13px] font-medium flex-1">{item.label}</span>
                {item.badge && <span className="text-[10px] font-bold bg-[#C1121F] text-white px-1.5 py-0.5 rounded-md leading-none">{item.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/[0.07] space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all text-[13px] font-medium"><Settings className="w-[18px] h-[18px]" /><span>Configuración</span></button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-[#C1121F] hover:bg-[rgba(193,18,31,0.08)] transition-all text-[13px] font-medium"><LogOut className="w-[18px] h-[18px]" /><span>Cerrar Sesión</span></button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#E8EBF0] flex items-center gap-4 px-6 z-20">
          <div className="flex items-center gap-2 text-[13px] text-[#9CA3AF]"><span className="text-[#1B2333] font-medium">{pageTitle}</span></div>
          <div className="flex-1 max-w-xs relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B0B8C4]" /><input type="search" placeholder="Buscar folio, hospital..." className="w-full pl-9 pr-4 py-2 text-[13px] bg-[#F2F4F8] rounded-xl outline-none" /></div>
          <div className="flex-1" />
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F2F4F8] text-[#6B7280]"><Bell className="w-[18px] h-[18px]" /><span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C1121F] border-2 border-white" /></button>
          <div className="w-px h-6 bg-[#E8EBF0]" />
          <div className="relative">
            <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-[#F2F4F8] transition-colors">
              <img src={user.image} alt={user.firstName} className="w-8 h-8 rounded-full bg-[#1B2333] border border-[#D4D8E1]" />
              <div className="text-left hidden sm:block">
                <div className="text-[13px] font-semibold text-[#1B2333] leading-none">{user.firstName} {user.lastName}</div>
                <div className="text-[11px] text-[#9CA3AF] mt-0.5">Administrador de Red</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-xl border border-[#E8EBF0] shadow-lg py-1.5 z-50">
                <div className="px-4 py-3 border-b border-[#F2F4F8]"><div className="text-[13px] font-semibold text-[#1B2333]">{user.firstName} {user.lastName}</div><div className="text-[11px] text-[#9CA3AF] mt-0.5">{user.email}</div></div>
                <div className="border-t border-[#F2F4F8] mt-1.5 pt-1.5"><button onClick={onLogout} className="w-full text-left px-4 py-2.5 text-[13px] text-[#BE123C] hover:bg-[#FFF1F2] transition-colors">Cerrar sesión</button></div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-8 relative">
          {active === "dashboard" && <DashboardHome onGoInventory={() => setActive("inventario")} />}
          {active === "inventario" && <InventoryTable />}
          {active === "red" && <PlaceholderSection title="Red de Hospitales" icon={Network} />}
          {active === "alertas" && <PlaceholderSection title="Alertas de Escasez" icon={TriangleAlert} />}
        </main>
      </div>
      {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
    </div>
  );
}