import React, { useState, useMemo } from "react";
import {
  Droplets, Eye, EyeOff, Shield, ChevronRight,
  LayoutDashboard, FlaskConical, Network, TriangleAlert,
  Bell, Search, ChevronDown, Settings, LogOut,
  TrendingUp, TrendingDown, Clock, ShieldCheck,
  SlidersHorizontal, Download, AlertTriangle,
  ChevronLeft, ChevronsLeft, ChevronsRight,
  ChevronUp,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

type View   = "login" | "dashboard";
type NavId  = "dashboard" | "inventario" | "red" | "alertas";
type BloodType = "A+" | "A−" | "B+" | "B−" | "O+" | "O−" | "AB+" | "AB−";
type Status    = "Disponible" | "En Tránsito" | "Cuarentena";
type SortKey   = "folio" | "bloodType" | "volume" | "expiry" | "status";
type SortDir   = "asc" | "desc";
type FilterKey = "all" | "expiring" | "quarantine" | BloodType;

interface BloodUnit {
  id: number; folio: string; bloodType: BloodType;
  volume: number; expiry: Date; status: Status; hospital: string;
}

const TODAY = new Date();
const d = (days: number) => new Date(TODAY.getTime() + days * 86_400_000);

const RAW_DATA: BloodUnit[] = [
  { id:  1, folio:"BLD-2026-00147", bloodType:"O+",  volume:450, expiry:d(3),  status:"Disponible",  hospital:"H. General del Norte"   },
  { id:  2, folio:"BLD-2026-00148", bloodType:"A+",  volume:350, expiry:d(18), status:"Disponible",  hospital:"H. Civil Guadalajara"    },
  { id:  3, folio:"BLD-2026-00149", bloodType:"B−",  volume:500, expiry:d(5),  status:"En Tránsito", hospital:"H. IMSS Monterrey"       },
  { id:  4, folio:"BLD-2026-00150", bloodType:"AB+", volume:450, expiry:d(22), status:"Cuarentena",  hospital:"H. Ángeles Puebla"       },
  { id:  5, folio:"BLD-2026-00151", bloodType:"O−",  volume:350, expiry:d(7),  status:"Disponible",  hospital:"H. General del Norte"   },
  { id:  6, folio:"BLD-2026-00152", bloodType:"A−",  volume:500, expiry:d(30), status:"Disponible",  hospital:"IMSS CMN Siglo XXI"      },
];

const BLOOD_COLORS: Record<BloodType, { bg: string; text: string }> = {
  "O+": { bg:"#FEF2F2", text:"#B91C1C" }, "O−": { bg:"#FFF7ED", text:"#C2410C" },
  "A+": { bg:"#EFF6FF", text:"#1D4ED8" }, "A−": { bg:"#EEF2FF", text:"#4338CA" },
  "B+": { bg:"#F0FDF4", text:"#15803D" }, "B−": { bg:"#ECFDF5", text:"#065F46" },
  "AB+":{ bg:"#FDF4FF", text:"#7E22CE" }, "AB−":{ bg:"#FAF5FF", text:"#6B21A8" },
};

const STATUS_META: Record<Status, { bg:string; text:string; dot:string }> = {
  "Disponible":  { bg:"#F0FDF4", text:"#15803D", dot:"#22C55E" },
  "En Tránsito": { bg:"#FFF7ED", text:"#C2410C", dot:"#F97316" },
  "Cuarentena":  { bg:"#FFF1F2", text:"#BE123C", dot:"#FB7185" },
};

const NAV_ITEMS: { id: NavId; label: string; icon: React.ElementType; badge?: number }[] = [
  { id:"dashboard",  label:"Dashboard",              icon:LayoutDashboard },
  { id:"inventario", label:"Inventario Inteligente", icon:FlaskConical    },
  { id:"red",        label:"Red de Hospitales",      icon:Network         },
  { id:"alertas",    label:"Alertas de Escasez",     icon:TriangleAlert, badge:3 },
];

const KPI_CARDS = [
  { label:"Unidades Disponibles", value:"1,847", delta:"+4.2%", up:true,  sub:"vs. semana anterior", color:"#15803D", bgDot:"#DCFCE7" },
  { label:"En Tránsito",          value:"312",   delta:"+11%",  up:true,  sub:"6 hospitales activos",color:"#C2410C", bgDot:"#FEF3C7" },
  { label:"Próximos a Caducar",   value:"38",    delta:"−7 días",up:false, sub:"ventana crítica",    color:"#BE123C", bgDot:"#FFE4E6" },
  { label:"Hospitales Conectados",value:"147",   delta:"100%",  up:true,  sub:"todos en línea",      color:"#1D4ED8", bgDot:"#EFF6FF" },
];

const ALERTS_DATA = [
  { type:"critical", label:"O− por debajo de mínimo", hospital:"H. General Norte",    time:"Hace 12 min" },
  { type:"warning",  label:"AB+ caduca en 48 h",      hospital:"H. Civil Guadalajara", time:"Hace 35 min" },
  { type:"warning",  label:"Stock B− bajo",           hospital:"IMSS CMN Siglo XXI",  time:"Hace 1 h"    },
];

function daysUntil(date: Date) {
  return Math.round((date.getTime() - TODAY.getTime()) / 86_400_000);
}
function fmtDate(date: Date) {
  return date.toLocaleDateString("es-MX", { day:"2-digit", month:"short", year:"numeric" });
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN (Con control de acceso)
// ═══════════════════════════════════════════════════════════════════════════

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [showPwd, setShowPwd]   = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulamos un retraso de red y luego cambiamos de pantalla
    setTimeout(() => { setLoading(false); onLogin(); }, 1400);
  }

  const stats = [
    { label:"Hospitales conectados", value:"147"    },
    { label:"Donaciones trazadas",   value:"2.4M"   },
    { label:"Unidades en stock",     value:"18,320" },
  ];

  return (
    <div className="min-h-screen flex" style={{ fontFamily:"'Inter', sans-serif" }}>
      {/* --- PANEL IZQUIERDO --- */}
      <aside className="hidden lg:flex w-[42%] bg-[#1B2333] flex-col p-14 relative overflow-hidden select-none">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:`repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 48px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 48px)` }} />
        <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full bg-[#C1121F] opacity-[0.07] pointer-events-none" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C1121F] flex items-center justify-center flex-shrink-0 shadow-lg">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-[17px] leading-none tracking-tight">DonaVida</div>
            <div className="text-white/35 text-[10px] mt-1 tracking-[0.15em] uppercase font-medium">Trazabilidad</div>
          </div>
        </div>

        <div className="relative mt-auto mb-16">
          <div className="w-8 h-[2px] bg-[#C1121F] mb-8 rounded-full" />
          <h1 className="text-white text-[28px] font-semibold leading-[1.35] tracking-tight mb-4">
            Red Nacional de<br />Bancos de Sangre
          </h1>
          <p className="text-white/45 text-[13px] leading-relaxed max-w-[280px]">
            Sistema integrado de trazabilidad para donaciones, análisis y distribución de hemoderivados en la red hospitalaria.
          </p>
        </div>

        <div className="relative border-t border-white/10 pt-8 grid grid-cols-3 gap-4">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-white text-xl font-semibold tracking-tight">{s.value}</div>
              <div className="text-white/35 text-[11px] mt-1.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </aside>

      {/* --- FORMULARIO --- */}
      <main className="flex-1 bg-[#F2F4F8] flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-10">
            <div className="flex items-center gap-1.5 text-[#C1121F] text-[10px] font-semibold tracking-[0.18em] uppercase mb-4">
              <Shield className="w-3 h-3" /> Acceso Institucional
            </div>
            <h2 className="text-[#1B2333] text-[28px] font-semibold leading-[1.3] tracking-tight">
              Acceso a Red<br />de Hospitales
            </h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label className="block text-[#1B2333] text-[13px] font-semibold mb-2 tracking-tight">Correo institucional</label>
              <div className={`flex items-center bg-white rounded-xl border transition-all duration-150 ${ focused==="email" ? "border-[#1B2333] shadow-[0_0_0_3px_rgba(27,35,51,0.08)]" : "border-[#D4D8E1]" }`}>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} placeholder="usuario@hospital.gob" className="flex-1 px-4 py-[14px] text-[#1B2333] placeholder:text-[#B0B8C4] bg-transparent outline-none text-[14px] rounded-xl" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[#1B2333] text-[13px] font-semibold mb-2 tracking-tight">Contraseña</label>
              <div className={`flex items-center bg-white rounded-xl border transition-all duration-150 ${ focused==="password" ? "border-[#1B2333] shadow-[0_0_0_3px_rgba(27,35,51,0.08)]" : "border-[#D4D8E1]" }`}>
                <input id="password" type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} placeholder="••••••••••" className="flex-1 px-4 py-[14px] text-[#1B2333] placeholder:text-[#B0B8C4] bg-transparent outline-none text-[14px] rounded-xl" />
                <button type="button" onClick={() => setShowPwd(v => !v)} className="pr-4 text-[#9CA3AF] hover:text-[#6B7280]">
                  {showPwd ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-8 bg-[#C1121F] hover:bg-[#A80F1A] disabled:opacity-60 text-white py-[15px] px-6 rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md">
              {loading ? "Verificando credenciales…" : <> Entrar al Sistema <ChevronRight className="w-4 h-4" /> </>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD HOME
// ═══════════════════════════════════════════════════════════════════════════

function DashboardHome() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[#1B2333] text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-[#9CA3AF] text-[13px] mt-1">Resumen operativo · actualizado hoy, 08:42 hrs</p>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {KPI_CARDS.map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-[#E8EBF0] px-5 py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide leading-tight">{k.label}</span>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:k.bgDot }}>
                {k.up ? <TrendingUp className="w-3.5 h-3.5" style={{ color:k.color }} /> : <TrendingDown className="w-3.5 h-3.5" style={{ color:k.color }} />}
              </span>
            </div>
            <div className="text-[28px] font-semibold text-[#1B2333] leading-none tracking-tight">{k.value}</div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold" style={{ color:k.color }}>{k.delta}</span>
              <span className="text-[11px] text-[#B0B8C4]">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Contenido Principal (Tabla previsualizada y Alertas) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E8EBF0] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#F2F4F8] flex items-center justify-between">
            <div>
              <div className="text-[15px] font-semibold text-[#1B2333] tracking-tight">Inventario de Sangre Activo</div>
              <div className="text-[12px] text-[#9CA3AF] mt-0.5">Vista previa · {RAW_DATA.length} registros totales</div>
            </div>
            <button className="text-[12px] font-semibold text-[#C1121F] flex items-center gap-1 hover:underline">
              Ver completo <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-[#F9FAFB]">
                  {["Folio Único","Tipo","Volumen","Caducidad","Estatus"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase border-b">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RAW_DATA.map(row => {
                  const bC = BLOOD_COLORS[row.bloodType];
                  const sM = STATUS_META[row.status];
                  return (
                    <tr key={row.id} className="border-b border-[#F2F4F8] hover:bg-[#FAFBFC]">
                      <td className="px-5 py-3.5"><span className="font-mono text-[10px] bg-[#F2F4F8] px-1.5 py-0.5 rounded text-[#1B2333]">{row.folio}</span></td>
                      <td className="px-5 py-3.5"><span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[11px] font-bold" style={{ background:bC.bg, color:bC.text }}>{row.bloodType}</span></td>
                      <td className="px-5 py-3.5 text-[#1B2333] font-medium">{row.volume} ml</td>
                      <td className="px-5 py-3.5"><span className="font-medium text-[#1B2333]">{fmtDate(row.expiry)}</span></td>
                      <td className="px-5 py-3.5"><span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-semibold" style={{ background:sM.bg, color:sM.text }}><span className="w-1.5 h-1.5 rounded-full" style={{ background:sM.dot }} />{row.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel derecho: Alertas y Sistema */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-[#E8EBF0] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F2F4F8] flex items-center justify-between">
              <div className="flex items-center gap-2"><TriangleAlert className="w-4 h-4 text-[#C1121F]" /><span className="text-[14px] font-semibold text-[#1B2333]">Alertas Activas</span></div>
              <span className="text-[10px] font-bold bg-[#C1121F] text-white px-2 py-0.5 rounded-md">3</span>
            </div>
            <div className="divide-y divide-[#F2F4F8]">
              {ALERTS_DATA.map((a, i) => (
                <div key={i} className="px-5 py-3.5 flex gap-3 items-start">
                  <span className="mt-0.5 w-2 h-2 rounded-full" style={{ background:a.type==="critical"?"#C1121F":"#F97316" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-[#1B2333] truncate">{a.label}</div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5">{a.hospital}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#B0B8C4]"><Clock className="w-3 h-3" />{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8EBF0] px-5 py-5">
            <div className="flex items-center gap-2 mb-4"><ShieldCheck className="w-4 h-4 text-[#15803D]" /><span className="text-[14px] font-semibold text-[#1B2333]">Estado del Sistema</span></div>
            <div className="space-y-3">
              {[ { name:"API de Trazabilidad", ok:true }, { name:"Sincronización IMSS", ok:true }, { name:"Módulo de Alertas", ok:true }, { name:"Respaldo en Nube", ok:false }].map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="text-[12px] text-[#6B7280]">{s.name}</span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color:s.ok?"#15803D":"#C2410C" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background:s.ok?"#22C55E":"#F97316" }} />{s.ok?"Operativo":"Degradado"}
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

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD CONTENEDOR (Navegación y Cabecera)
// ═══════════════════════════════════════════════════════════════════════════

function DashboardShell({ onLogout }: { onLogout: () => void }) {
  const [active, setActive] = useState<NavId>("dashboard");

  return (
    <div className="flex h-screen bg-[#F2F4F8] overflow-hidden" style={{ fontFamily:"'Inter', sans-serif" }}>
      
      {/* Sidebar Oscuro */}
      <aside className="w-[240px] flex-shrink-0 flex flex-col bg-[#1B2333] transition-all duration-200">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.07]">
          <div className="w-9 h-9 rounded-xl bg-[#C1121F] flex items-center justify-center flex-shrink-0"><Droplets className="w-4 h-4 text-white" /></div>
          <div><div className="text-white font-semibold text-[15px] leading-none">DonaVida</div><div className="text-white/35 text-[10px] tracking-[0.14em] uppercase mt-1">Trazabilidad</div></div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <div className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-3">Módulos</div>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => setActive(item.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all relative" style={isActive ? { background:"rgba(193,18,31,0.15)", color:"#fff" } : { color:"rgba(255,255,255,0.5)" }}>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#C1121F]" />}
                <Icon className="w-[18px] h-[18px]" style={{ color:isActive?"#C1121F":undefined }} />
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

      {/* Columna Principal Blanca */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#E8EBF0] flex items-center gap-4 px-6 z-20">
          <div className="flex items-center gap-2 text-[13px] text-[#9CA3AF]"><span className="text-[#1B2333] font-medium">Dashboard</span></div>
          <div className="flex-1 max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B0B8C4]" />
            <input type="search" placeholder="Buscar folio, hospital..." className="w-full pl-9 pr-4 py-2 text-[13px] bg-[#F2F4F8] rounded-xl outline-none" />
          </div>
          <div className="flex-1" />
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F2F4F8] text-[#6B7280]"><Bell className="w-[18px] h-[18px]" /><span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C1121F] border-2 border-white" /></button>
          <div className="w-px h-6 bg-[#E8EBF0]" />
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-[#1B2333] flex items-center justify-center text-white text-[12px] font-semibold">MA</div>
            <div><div className="text-[13px] font-semibold text-[#1B2333] leading-none">Mónica Alcántara</div><div className="text-[11px] text-[#9CA3AF] mt-0.5">Administradora Central</div></div>
            <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-8">
          <DashboardHome />
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NÚCLEO DE LA APLICACIÓN (Controlador de Rutas)
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  // Aquí ocurre la magia del cambio de pantalla
  const [view, setView] = useState<View>("login");

  return view === "login"
    ? <LoginScreen onLogin={() => setView("dashboard")} />
    : <DashboardShell onLogout={() => setView("login")} />;
}