import { Calendar, ChevronDown, Users, TrendingUp, Book } from "lucide-react";
import PageHeader from "../components/PageHeader";
import "./Dashboard.css";




// Datos de ejemplo; mas adelante pueden salir del catalogo real
const stats = [
  {
    label: "Libros disponibles",
    value: "1.284",
    trend: "+12,5%",
    note: "vs. periodo anterior",
    icon: Users,
  },
];

export default function Dashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Consulta de libros"
        title="Bienvenido a la biblioteca"
        subtitle="Aquí tienes un resumen de lo que ocurre hoy en la biblioteca."
      >
        <button type="button" className="period">
          <Calendar size={20} />
          <span className="period__text">
            <small>PERIODO</small>
            01 – 31 marzo, 2025
          </span>
          <ChevronDown size={16} />
        </button>
      </PageHeader>

      <section className="stats">
        {stats.map(({ label, value, trend, note, icon: Icon }) => (
          <article className="stat-card" key={label}>
            <div className="stat-card__icon">
              <Icon size={20} />
            </div>
            <p className="stat-card__label">{label}</p>
            <div className="stat-card__row">
              <strong className="stat-card__value">{value}</strong>
              <span className="stat-card__trend">
                <TrendingUp size={14} />
                {trend}
              </span>
            </div>
            <p className="stat-card__note">{note}</p>
          </article>
        ))}
      </section>
    </>
  );
}
