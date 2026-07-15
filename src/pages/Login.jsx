import { useState } from "react";
import { Droplets, Shield, ChevronRight, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { apiService } from "../services/api.js";

export default function Login({ onLogin }) {
  const [showPwd, setShowPwd] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Por favor, ingresa tu usuario y contraseña.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiService.login(username, password);
      onLogin(data);
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos");
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
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      <aside className="hidden lg:flex w-[42%] bg-[#1B2333] flex-col p-14 relative overflow-hidden select-none">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 48px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 48px)` }} />
        <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full bg-[#C1121F] opacity-[0.07] pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C1121F] flex items-center justify-center flex-shrink-0 shadow-lg">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-[17px] leading-none tracking-tight"></div>
            <div className="text-white/35 text-[10px] mt-1 tracking-[0.15em] uppercase font-medium">Trazabilidad</div>
          </div>
        </div>
        <div className="relative mt-auto mb-16">
          <div className="w-8 h-[2px] bg-[#C1121F] mb-8 rounded-full" />
          <h1 className="text-white text-[28px] font-semibold leading-[1.35] tracking-tight mb-4">Red Nacional de<br />Bancos de Sangre</h1>
          <p className="text-white/45 text-[13px] leading-relaxed max-w-[280px]">Sistema integrado de trazabilidad para donaciones, análisis y distribución de hemoderivados en la red hospitalaria.</p>
        </div>
        <div className="relative border-t border-white/10 pt-8 grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-white text-xl font-semibold tracking-tight">{s.value}</div>
              <div className="text-white/35 text-[11px] mt-1.5 leading-tight">{s.label}</div>
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
            <h2 className="text-[#1B2333] text-[28px] font-semibold leading-[1.3] tracking-tight">Acceso a Red<br />de Hospitales</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="mb-5 p-3.5 bg-[#FFF1F2] border border-[#FECDD3] rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#BE123C] flex-shrink-0 mt-0.5" />
                <span className="text-[13px] font-medium text-[#BE123C]">{error}</span>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-[#1B2333] text-[13px] font-semibold mb-2 tracking-tight">Usuario (API DummyJSON)</label>
              <div className="flex items-center bg-white rounded-xl border border-[#D4D8E1]">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ej. emilys" className="flex-1 px-4 py-[14px] text-[#1B2333] placeholder:text-[#B0B8C4] bg-transparent outline-none text-[14px] rounded-xl" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[#1B2333] text-[13px] font-semibold mb-2 tracking-tight">Contraseña</label>
              <div className="flex items-center bg-white rounded-xl border border-[#D4D8E1]">
                <input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••" className="flex-1 px-4 py-[14px] text-[#1B2333] placeholder:text-[#B0B8C4] bg-transparent outline-none text-[14px] rounded-xl" />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="pr-4 text-[#9CA3AF] hover:text-[#6B7280]">
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