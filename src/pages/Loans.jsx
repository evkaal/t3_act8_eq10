import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { getLoans, returnLoan, updateLoan } from "../services/loansService";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [editingCode, setEditingCode] = useState(null);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    setLoans(getLoans());
  }, []);

  // BORRAR (Delete)
  const handleReturn = (code) => {
    if (window.confirm("¿Estás seguro de devolver/eliminar este préstamo?")) {
      const updated = returnLoan(code);
      setLoans(updated);
      alert("Libro devuelto correctamente.");
    }
  };

  // ACTUALIZAR (Update) - Iniciar edición
  const handleEditClick = (loan) => {
    setEditingCode(loan.code);
    setNewNote(loan.notes || "");
  };

  // ACTUALIZAR (Update) - Guardar cambios
  const handleSaveUpdate = (code) => {
    const updated = updateLoan(code, { notes: newNote });
    setLoans(updated);
    setEditingCode(null);
    alert("Préstamo actualizado correctamente.");
  };

  return (
    <>
      <PageHeader
        eyebrow="Biblioteca"
        title="Mis préstamos"
        subtitle="Administra tus libros prestados."
      />

      <div style={{ padding: "0 2rem 2rem 2rem" }}>
        {loans.length === 0 ? (
          <p style={{ color: "#6b7280", marginTop: "1rem" }}>
            No tienes libros en préstamo actualmente. Ve al catálogo para solicitar uno.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, marginTop: "1.5rem" }}>
            {loans.map((book) => (
              <li
                key={book.code}
                style={{
                  background: "#ffffff",
                  padding: "1.2rem 1.5rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <strong style={{ fontSize: "1.1rem", color: "#1f2937" }}>
                      {book.title}
                    </strong>{" "}
                    <span style={{ color: "#4b5563" }}>({book.author})</span>
                    <br />
                    <small style={{ color: "#6b7280" }}>
                      📅 Fecha límite: {new Date(book.dueDate).toLocaleDateString()}
                    </small>
                    <br />
                    <small style={{ color: "#2563eb" }}>
                      📝 Notas: {book.notes}
                    </small>
                  </div>

                  {/* Acciones de Actualizar y Borrar */}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleEditClick(book)}
                      className="btn"
                      style={{ backgroundColor: "#eab308", color: "white", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Editar (Actualizar)
                    </button>
                    <button
                      onClick={() => handleReturn(book.code)}
                      style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Devolver (Borrar)
                    </button>
                  </div>
                </div>

                {/* Formulario desplegable para Editar (Actualizar) */}
                {editingCode === book.code && (
                  <div style={{ background: "#f9fafb", padding: "0.8rem", borderRadius: "6px", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Actualizar notas del préstamo..."
                      style={{ flex: 1, padding: "0.4rem", borderRadius: "4px", border: "1px solid #d1d5db" }}
                    />
                    <button
                      onClick={() => handleSaveUpdate(book.code)}
                      style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingCode(null)}
                      style={{ backgroundColor: "#9ca3af", color: "white", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}