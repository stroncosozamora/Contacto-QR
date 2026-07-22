import { getDistributionSnapshot } from "../../lib/assignment";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const { total, assignments, recent, message, nextAdvisor } =
    await getDistributionSnapshot({ recentLimit: 30 });

  return (
    <main className="container">
      <header className="header">
        <div>
          <p className="eyebrow">CONTACTO QR</p>
          <h1>Panel de distribución</h1>
          <p className="muted">Asignación correlativa y persistente en Redis.</p>
        </div>
        <div className="actions">
          <a className="button secondary" href="/admin">Actualizar</a>
          <a className="button" href="/api/export">Exportar CSV</a>
        </div>
      </header>

      <section className="grid">
        <article className="card total-card">
          <span>Total de asignaciones</span>
          <strong>{total}</strong>
          <small>Siguiente: {nextAdvisor.name}</small>
        </article>

        {assignments.map((advisor) => (
          <article className="card" key={advisor.id}>
            <span>{advisor.name}</span>
            <strong>{advisor.assigned}</strong>
            <small>
              {advisor.phone} · {advisor.percentage.toFixed(1)}%
            </small>
          </article>
        ))}
      </section>

      <section className="card section-card">
        <h2>Configuración activa</h2>
        <dl className="settings">
          <div><dt>Modo</dt><dd>Correlativo estricto (round-robin)</dd></div>
          <div><dt>Mensaje</dt><dd>{message}</dd></div>
          <div><dt>URL del QR</dt><dd>Dominio principal del proyecto</dd></div>
          <div><dt>Próxima asignación</dt><dd>{nextAdvisor.name}</dd></div>
        </dl>
      </section>

      <section className="card section-card">
        <h2>Últimas asignaciones</h2>
        {recent.length === 0 ? (
          <p className="muted">Todavía no hay registros.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>N.º</th><th>Asesor</th><th>Fecha y hora</th></tr>
              </thead>
              <tbody>
                {recent.map((entry) => (
                  <tr key={`${entry.scanNumber}-${entry.timestamp}`}>
                    <td>{entry.scanNumber}</td>
                    <td>{entry.advisorName}</td>
                    <td>{new Date(entry.timestamp).toLocaleString("es-CL", {
                      timeZone: "America/Santiago",
                      dateStyle: "short",
                      timeStyle: "medium",
                    })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
