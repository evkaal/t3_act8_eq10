// src/pages/Dashboard.jsx
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Dashboard({ user, onLogout }) {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f6f9' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar user={user} onLogout={onLogout} />
        <main style={{ padding: '2rem', overflowY: 'auto' }}>
          <h2>¡Bienvenido al sistema, {user.firstName}! 🎉</h2>
          <p>Aquí es donde colocaremos la tabla de datos con filtros, paginación y CRUD en la siguiente fase.</p>
        </main>
      </div>
    </div>
  );
}