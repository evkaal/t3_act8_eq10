// src/pages/Login.jsx
import { useState } from 'react';
import { loginUser } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación previa: campos vacíos
    if (!username.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      const userData = await loginUser(username, password);
      // Si el login es exitoso, pasamos los datos al componente principal (App.jsx)
      onLoginSuccess(userData);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Iniciar Sesión</h2>
        
        {error && <div style={{ marginBottom: '1rem', color: '#dc3545', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>{error}</div>}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px' }}>Usuario o Correo</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ej. emilys"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px' }}>Contraseña</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ej. emilyspass"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Verificando...' : 'Entrar'}
        </button>

        <p style={{ marginTop: '1rem', fontSize: '12px', color: '#666', textAlign: 'center' }}>
          💡 Pista: Usa usuario <strong>emilys</strong> y contraseña <strong>emilyspass</strong>
        </p>
      </form>
    </div>
  );
}