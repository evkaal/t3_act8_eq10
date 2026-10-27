import { NotebookTabs } from "lucide-react";


const LOANS_KEY = "library_user_loans";

// Obtener todos los préstamos actuales
export function getLoans() {
  try {
    const data = localStorage.getItem(LOANS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error al leer los préstamos", e);
    return [];
  }
}

// Registrar un nuevo préstamo
export function createLoan(book) {
  const loans = getLoans();
  
  // Verificar si ya está prestado
  if (loans.some((item) => item.code === book.code)) {
    throw new Error("Este libro ya se encuentra en tus préstamos.");
  }

  const newLoan = {
    id: book.code, 
    ...book,
    loanDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 semanas de plazo
    notes: "prestamo regular",
  };

  loans.push(newLoan);
  localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
  return loans;
}

// 3. ACTUALIZAR (Update) - Ejemplo: Actualizar la nota o fecha límite
export function updateLoan(bookCode, updatedData) {
  let loans = getLoans();
  loans = loans.map((item) => {
    if (item.code === bookCode) {
      return { ...item, ...updatedData };
    }
    return item;
  });
  localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
  return loans;
}


// Devolver un libro (Eliminar del préstamo)
export function returnLoan(bookCode) {
  let loans = getLoans();
  loans = loans.filter((item) => item.code !== bookCode);
  localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
  return loans;
}