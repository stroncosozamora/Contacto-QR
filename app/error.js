"use client";

export default function ErrorPage({ reset }) {
  return (
    <main className="error-page">
      <section className="card error-card">
        <p className="eyebrow">CONTACTO QR</p>
        <h1>No pudimos abrir WhatsApp</h1>
        <p className="muted">
          El servicio de distribución no respondió correctamente. Intenta nuevamente.
        </p>
        <button className="button button-reset" onClick={() => reset()}>
          Reintentar
        </button>
      </section>
    </main>
  );
}
