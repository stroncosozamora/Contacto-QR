import "./styles.css";

export const metadata = {
  title: "Contacto WhatsApp",
  description: "Distribución correlativa de contactos por WhatsApp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
