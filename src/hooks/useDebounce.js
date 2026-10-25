import { useEffect, useState } from "react";

// Devuelve `value` pero solo despues de que dejo de cambiar durante `delay` ms.
// Sirve para no llamar a la API en cada tecla que escribe el usuario.
export default function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // si el valor cambia antes, cancela
  }, [value, delay]);

  return debounced;
}
