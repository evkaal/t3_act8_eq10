import { Plus } from "lucide-react";

function initials(title) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function Table({ books, loading, error, onRetry, onBorrow }) {
  const renderBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className="table__state">
            <span className="spinner" />
            Cargando libros...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={6} className="table__state table__state--error">
            <p>{error}</p>
            <button type="button" className="btn btn--ghost" onClick={onRetry}>
              Reintentar
            </button>
          </td>
        </tr>
      );
    }

    if (books.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="table__state">
            No se encontraron libros con esos filtros.
          </td>
        </tr>
      );
    }

    return books.map((book) => (
      <tr key={book.id || book.code}>
        <td className="table__code">{book.code}</td>
        <td>
          <div className="book">
            {book.cover ? (
              <img className="book__cover" src={book.cover} alt="" loading="lazy" />
            ) : (
              <span className="book__initials">{initials(book.title)}</span>
            )}
            <div className="book__text">
              <strong>{book.title}</strong>
              <span>{book.author}</span>
            </div>
          </div>
        </td>
        <td>{book.author}</td>
        <td>{book.publisher}</td>
        <td>
          <span className={`badge ${book.available ? "badge--ok" : "badge--muted"}`}>
            {book.available ? "Disponible" : "Solo consulta"}
          </span>
        </td>
        <td className="table__actions">
          {/* Botón para Crear el préstamo */}
          <button
            type="button"
            className="btn btn--primary"
            style={{ padding: "0.3rem 0.6rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "4px" }}
            onClick={() => onBorrow && onBorrow(book)}
          >
            <Plus size={16} />
            Prestar
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Editorial</th>
            <th>Disponibilidad</th>
            <th className="table__actions">Acciones</th>
          </tr>
        </thead>
        <tbody>{renderBody()}</tbody>
      </table>
    </div>
  );
}