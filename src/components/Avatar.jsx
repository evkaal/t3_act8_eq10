// Muestra la foto del usuario; si no hay, sus iniciales
export default function Avatar({ user, size = 36 }) {
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="avatar" style={{ width: size, height: size }}>
      {user?.image ? (
        <img src={user.image} alt={`${user.firstName} ${user.lastName}`} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
