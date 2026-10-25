import { ChevronLeft, ChevronRight } from "lucide-react";

// Calcula que botones mostrar: 1 ... 4 5 6 ... 20
function getPages(page, totalPages) {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...wanted]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push(`gap-${p}`);
    result.push(p);
  });
  return result;
}

export default function Pagination({
  page,
  total,
  limit,
  limits,
  onPageChange,
  onLimitChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <footer className="pagination">
      <div className="pagination__info">
        <span>
          Mostrando{" "}
          <strong>
            {from}–{to}
          </strong>{" "}
          de <strong>{total.toLocaleString("es-MX")}</strong> libros
        </span>

        <label className="pagination__limit">
          Por página
          <select value={limit} onChange={(e) => onLimitChange(Number(e.target.value))}>
            {limits.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <nav className="pagination__pages" aria-label="Paginación">
        <button
          type="button"
          className="page-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {getPages(page, totalPages).map((p) =>
          typeof p === "string" ? (
            <span key={p} className="page-gap">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`page-btn ${p === page ? "page-btn--active" : ""}`}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className="page-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </footer>
  );
}
