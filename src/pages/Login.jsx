import { useState } from "react";
import { Mail, ShieldCheck, Eye, EyeOff, ArrowRight } from "lucide-react";
import { loginRequest } from "../services/authService";
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); // errores de validacion por campo
  const [apiError, setApiError] = useState(""); // error que viene de la API
  const [loading, setLoading] = useState(false);

  // Devuelve true si todo esta bien; si no, llena `errors`
  const validate = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Ingresa tu usuario o correo.";
    } else if (username.trim().length < 3) {
      newErrors.username = "Debe tener al menos 3 caracteres.";
    }

    if (!password) {
      newErrors.password = "Ingresa tu contraseña.";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // evita que la pagina se recargue
    setApiError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const data = await loginRequest(username.trim(), password);
      onLogin(data, remember); // avisamos a App que ya hay usuario
    } catch (err) {
      setApiError(
        err.message === "Failed to fetch"
          ? "No se pudo conectar con el servidor. Revisa tu internet."
          : "Usuario o contraseña incorrectos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login">
      {/* Panel izquierdo */}
      <section className="login__hero">
        <span className="login__ring" />
        <span className="login__dot login__dot--teal" />
        <span className="login__dot login__dot--blue" />

        <div className="login__hero-content">
          <h1 className="login__title">
            Explora, consulta
            <br />
            y haz que todo <span>fluya.</span>
          </h1>
          <p className="login__subtitle">
            Un solo espacio para consultar libros, seguir tus préstamos y
            encontrar lo que buscas en la biblioteca...
          </p>
        </div>
      </section>

      {/* Panel derecho */}
      <section className="login__panel">
        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <h2 className="login__form-title">Inicia sesión en la biblioteca</h2>
          <p className="login__form-sub">
            Ingresa tus datos para consultar libros, préstamos y tu catálogo.
          </p>

          {/* Usuario */}
          <div className="field field--first">
            <div className="field__label-row">
              <label htmlFor="username">Usuario o correo</label>
            </div>
            <div className={`input ${errors.username ? "input--error" : ""}`}>
              <Mail size={18} />
              <input
                id="username"
                type="text"
                placeholder="emilys"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-invalid={!!errors.username}
              />
            </div>
            {errors.username && <p className="field__error">{errors.username}</p>}
          </div>

          {/* Contraseña */}
          <div className="field">
            <div className="field__label-row">
              <label htmlFor="password">Contraseña</label>
              <button type="button" className="link-btn">
                ¿Olvidaste tu clave?
              </button>
            </div>
            <div className={`input ${errors.password ? "input--error" : ""}`}>
              <ShieldCheck size={18} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu clave"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                className="input__toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="field__error">{errors.password}</p>}
          </div>

          <label className="remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Mantener sesión activa
          </label>

          {apiError && (
            <div className="alert" role="alert">
              {apiError}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Verificando..." : "Acceder"}
            {!loading && <ArrowRight size={18} />}
          </button>

          <p className="login__help">
            ¿Necesitas ayuda?{" "}
            <button type="button" className="link-btn">
              Contacta a soporte
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}
