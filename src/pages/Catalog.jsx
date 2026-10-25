import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Download, Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import useDebounce from "../hooks/useDebounce";
import { fetchBooks } from "../services/booksService";
import "./Catalog.css";

const LIMITS = [10, 20, 40, 50];

const GENRES = [
  { value: "fiction", label: "Ficción" },
  { value: "fantasy", label: "Fantasía" },
  { value: "history", label: "Historia" },
  { value: "science", label: "Ciencia" },
  { value: "romance", label: "Romance" },
  { value: "mystery", label: "Misterio" },
  { value: "biography", label: "Biografía" },
  { value: "poetry", label: "Poesía" },
  { value: "children", label: "Infantil" },
  { value: "philosophy", label: "Filosofía" },
];

// Descarga los libros de la pagina actual como CSV
function exportCsv(books) {
  const header = ["Código", "Título", "Autor", "Editorial", "Año", "Disponibilidad"];
  const rows = books.map((b) => [
    b.code,
    b.title,
    b.author,
    b.publisher,
    b.year ?? "",
    b.available ? "Disponible" : "Solo consulta",
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "catalogo.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function Catalog() {
  const [params, setParams] = useSearchParams();

  // ---------- 1) La URL es la fuente de verdad de filtros y paginacion ----------
  const page = Math.max(1, parseInt(params.get("page"), 10) || 1);
  const limitParam = parseInt(params.get("limit"), 10);
  const limit = LIMITS.includes(limitParam) ? limitParam : 10;
  const search = params.get("q") ?? "";
  const genre = params.get("genre") ?? "";
  const availability = params.get("avail") ?? "";

  // Cambia parametros de la URL. Por defecto vuelve a la pagina 1.
  const updateParams = (changes, { resetPage = true, replace = false } = {}) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === "" || value == null) next.delete(key);
      else next.set(key, String(value));
    });
    if (resetPage) next.delete("page");
    setParams(next, { replace });
  };

  // ---------- 2) Estado de los datos ----------
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0); // para el boton "Reintentar"

  // ---------- 3) Caja de busqueda con debounce ----------
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Cuando el usuario deja de escribir, pasamos el texto a la URL
  useEffect(() => {
    const text = debouncedSearch.trim();
    if (text !== search) updateParams({ q: text }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Si la URL cambia por "atras/adelante", actualizamos la caja
  useEffect(() => {
    if (search !== debouncedSearch.trim()) setSearchInput(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // ---------- 4) Pedir los datos cada vez que cambia la URL ----------
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetchBooks({ search, genre, availability, page, limit, signal: controller.signal })
      .then(({ books, total }) => {
        setBooks(books);
        setTotal(total);
      })
      .catch((err) => {
        if (err.name === "AbortError") return; // peticion cancelada a proposito
        setBooks([]);
        setTotal(0);
        setError("No se pudo cargar el catálogo. Revisa tu conexión e inténtalo de nuevo.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    // Si cambian los filtros antes de terminar, cancelamos la peticion vieja
    return () => controller.abort();
  }, [search, genre, availability, page, limit, reloadKey]);

  return (
    <>
      <PageHeader
        eyebrow="Biblioteca"
        title="Catálogo de libros"
        subtitle="Explora, busca y consulta el catálogo de libros disponibles."
      >
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => exportCsv(books)}
          disabled={books.length === 0}
        >
          <Download size={18} />
          Exportar
        </button>
        {/* Se conecta al modal de "agregar" en el Paso 3B */}
        <button type="button" className="btn btn--primary">
          <Plus size={18} />
          Nuevo libro
        </button>
      </PageHeader>

      <section className="catalog-card">
        <div className="toolbar">
          <div className="search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar por título, autor o ISBN..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="toolbar__filters">
            <select
              value={availability}
              onChange={(e) => updateParams({ avail: e.target.value })}
              aria-label="Filtrar por disponibilidad"
            >
              <option value="">Toda disponibilidad</option>
              <option value="available">Disponible</option>
            </select>

            <select
              value={genre}
              onChange={(e) => updateParams({ genre: e.target.value })}
              aria-label="Filtrar por género"
            >
              <option value="">Todos los géneros</option>
              {GENRES.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Table
          books={books}
          loading={loading}
          error={error}
          onRetry={() => setReloadKey((k) => k + 1)}
        />

        <Pagination
          page={page}
          total={total}
          limit={limit}
          limits={LIMITS}
          onPageChange={(p) =>
            updateParams({ page: p === 1 ? "" : p }, { resetPage: false })
          }
          onLimitChange={(l) => updateParams({ limit: l })}
        />
      </section>
    </>
  );
}
