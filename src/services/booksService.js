// Servicio del catalogo. Todas las llamadas a la API de libros viven aqui.
const BASE_URL = import.meta.env.VITE_BOOKS_API_URL ?? "https://openlibrary.org";

// Solo pedimos los campos que usa la tabla (respuestas mas ligeras)
const FIELDS = [
  "key",
  "title",
  "author_name",
  "publisher",
  "first_publish_year",
  "cover_i",
  "subject",
  "isbn",
  "has_fulltext",
].join(",");

// Open Library necesita una consulta (q). La armamos con los filtros activos.
export function buildQuery({ search, genre, availability }) {
  const parts = [];
  if (search) parts.push(search);
  if (genre) parts.push(`subject:"${genre}"`);
  if (availability === "available") parts.push("has_fulltext:true");
  // Sin filtros mostramos libros en espanol como catalogo base
  if (parts.length === 0) parts.push("language:spa");
  return parts.join(" ");
}

// Convierte el formato de la API al formato que usa nuestra app
function normalizeBook(doc) {
  const id = String(doc.key).split("/").pop(); // "/works/OL123W" -> "OL123W"
  return {
    id,
    code: id,
    title: doc.title ?? "Sin título",
    author: doc.author_name?.[0] ?? "Autor desconocido",
    publisher: doc.publisher?.[0] ?? "—",
    year: doc.first_publish_year ?? null,
    genre: doc.subject?.[0] ?? "",
    isbn: doc.isbn?.[0] ?? "",
    cover: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`
      : null,
    available: Boolean(doc.has_fulltext),
  };
}

export async function fetchBooks({ search, genre, availability, page, limit, signal }) {
  const params = new URLSearchParams({
    q: buildQuery({ search, genre, availability }),
    page: String(page), // Open Library cuenta las paginas desde 1
    limit: String(limit),
    fields: FIELDS,
  });

  const res = await fetch(`${BASE_URL}/search.json?${params}`, { signal });

  // fetch no lanza error con un 500, hay que revisar res.ok
  if (!res.ok) {
    throw new Error(`La API respondió con el código ${res.status}`);
  }

  const data = await res.json();
  return {
    total: data.numFound ?? data.num_found ?? 0,
    books: (data.docs ?? []).map(normalizeBook),
  };
}
