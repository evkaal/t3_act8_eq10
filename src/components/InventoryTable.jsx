// src/components/InventoryTable.jsx
import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, Search, Loader2 } from "lucide-react";
import { apiService } from "../services/api.js";

export default function InventoryTable() {
  const searchParams = new URLSearchParams(window.location.search);
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit")) || 10);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ bloodType: "", volume: "", status: "Disponible" });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiService.getBloodData(page, limit, activeSearch);
        
        const mappedData = res.map((item, i) => {
          const types = ["A+", "O+", "B−", "AB+"];
          const statuses = ["Disponible", "En Tránsito", "Cuarentena"];
          return {
            id: i + 1,
            bloodType: types[i % types.length],
            volume: 350 + ((item.daily || 0) % 150) || 450,
            status: statuses[i % statuses.length],
          };
        });
        
        setData(mappedData);
        
        const url = new URL(window.location);
        url.searchParams.set("page", page);
        url.searchParams.set("limit", limit);
        window.history.pushState({}, "", url);
      } catch (err) {
        console.error("Detalle del error:", err);
        setError("Error al cargar el inventario.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, limit, activeSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchInput);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ bloodType: item.bloodType, volume: item.volume, status: item.status });
    } else {
      setEditingId(null);
      setFormData({ bloodType: "", volume: "", status: "Disponible" });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!window.confirm(`¿Seguro que deseas ${editingId ? 'editar' : 'agregar'} este registro de sangre?`)) return;
    
    try {
      if (editingId) {
        await apiService.updateRecord(editingId, formData);
        setData(data.map(item => item.id === editingId ? { ...item, ...formData } : item));
      } else {
        await apiService.addRecord(formData);
        setData([{ ...formData, id: Date.now() }, ...data]); 
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Detalle del error:", err);
      alert("Error al guardar.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás completamente seguro de eliminar esta unidad de sangre del sistema?")) return;
    try {
      await apiService.deleteRecord(id);
      setData(data.filter(item => item.id !== id));
    } catch (err) {
      console.error("Detalle del error:", err);
      alert("Error al eliminar.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input type="text" placeholder="Buscar tipo (ej. A+)..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
          <button type="submit" className="bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300"><Search className="w-4 h-4" /></button>
        </form>
        <button onClick={() => openModal()} className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Registro
        </button>
      </div>

      <div className="overflow-x-auto min-h-[300px] relative">
        {loading && <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10"><Loader2 className="w-8 h-8 animate-spin text-red-700" /></div>}
        {error && <div className="p-8 text-center text-red-600 font-semibold">{error}</div>}
        
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3">Folio ID</th>
              <th className="px-6 py-3">Tipo de Sangre</th>
              <th className="px-6 py-3">Volumen (ml)</th>
              <th className="px-6 py-3">Estatus</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 font-semibold font-mono text-gray-900">{item.id}</td>
                <td className="px-6 py-3 font-bold text-red-700">{item.bloodType}</td>
                <td className="px-6 py-3">{item.volume} ml</td>
                <td className="px-6 py-3"><span className="px-2 py-1 bg-gray-200 rounded text-xs">{item.status}</span></td>
                <td className="px-6 py-3 flex justify-end gap-2">
                  <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Registros por página:</span>
          <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1 outline-none">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Anterior</button>
          <span className="px-3 py-1 font-semibold">Página {page}</span>
          <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Siguiente</button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg font-bold mb-4">{editingId ? 'Editar' : 'Nuevo'} Registro</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input required type="text" placeholder="Tipo (Ej. O+)" value={formData.bloodType} onChange={e => setFormData({...formData, bloodType: e.target.value})} className="w-full border p-2 rounded outline-none" />
              <input required type="number" placeholder="Volumen (ml)" value={formData.volume} onChange={e => setFormData({...formData, volume: e.target.value})} className="w-full border p-2 rounded outline-none" />
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border p-2 rounded outline-none bg-white">
                <option value="Disponible">Disponible</option>
                <option value="En Tránsito">En Tránsito</option>
                <option value="Cuarentena">Cuarentena</option>
              </select>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-700 text-white rounded font-semibold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}