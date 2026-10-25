const API_URL = import.meta.env.VITE_API_URL;

export async function loginRequest(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  // fetch NO lanza error con un 400, hay que revisar res.ok
  if (!res.ok) {
    throw new Error(data.message || "Usuario o contraseña incorrectos");
  }

  // Trae: firstName, lastName, username, email, image, accessToken...
  return data;
}
