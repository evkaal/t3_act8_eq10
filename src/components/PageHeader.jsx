// Encabezado reutilizable de cada pagina (eyebrow + titulo + subtitulo + acciones)
export default function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <header className="page-header">
      <div>
        <p className="page-header__eyebrow">{eyebrow}</p>
        <h1 className="page-header__title">{title}</h1>
        <p className="page-header__subtitle">{subtitle}</p>
      </div>
      {children && <div className="page-header__actions">{children}</div>}
    </header>
  );
}
