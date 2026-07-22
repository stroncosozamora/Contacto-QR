export function getConfig() {
  const advisors = [
    {
      id: "1",
      name: process.env.WHATSAPP_1_NAME || "Sebastián",
      phone: process.env.WHATSAPP_1 || "56978088523",
    },
    {
      id: "2",
      name: process.env.WHATSAPP_2_NAME || "Asesor 2",
      phone: process.env.WHATSAPP_2 || "56948850826",
    },
  ].filter((advisor) => /^\d{8,15}$/.test(advisor.phone));

  if (advisors.length === 0) {
    throw new Error("No hay números de WhatsApp válidos configurados.");
  }

  return {
    advisors,
    message:
      process.env.WHATSAPP_MESSAGE ||
      "Hola, me gustaría tener más información.",
  };
}
