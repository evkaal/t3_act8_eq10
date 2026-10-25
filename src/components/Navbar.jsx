// src/components/Navbar.jsx
export default function Navbar({ user, onLogout }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#fff', borderBottom: '1px solid #ddd' }}>
      <h2>Dashboard del Sistema</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user?.image && (
          <img 
            src={user.image} 
            alt="Perfil" 
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
          />
        )}
        <span>{user?.firstName || user?.username || 'Usuario'}</span>
        
        <button 
          onClick={onLogout}
          style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}