// src/components/Sidebar.jsx
export default function Sidebar() {
  return (
    <aside style={{ width: '250px', backgroundColor: '#343a40', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3>Menú</h3>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <li><a href="#inicio" style={{ color: 'white', textDecoration: 'none' }}>🏠 Inicio</a></li>
        <li><a href="#productos" style={{ color: 'white', textDecoration: 'none' }}>📦 Productos / CRUD</a></li>
        <li><a href="#config" style={{ color: 'white', textDecoration: 'none' }}>⚙️ Configuración</a></li>
      </ul>
    </aside>
  );
}