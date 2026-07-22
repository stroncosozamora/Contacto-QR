import { getRedis } from "./redis";
import { getConfig } from "./config";

const TOTAL_KEY = "contacto:scan:total";
const RECENT_KEY = "contacto:recent";
const HISTORY_LIMIT = 1000;

export async function assignNextAdvisor() {
  const redis = getRedis();
  const { advisors, message } = getConfig();

  // INCR es atómico: cada solicitud recibe un correlativo único,
  // incluso cuando varias personas escanean al mismo tiempo.
  const scanNumber = Number(await redis.incr(TOTAL_KEY));
  const advisorIndex = (scanNumber - 1) % advisors.length;
  const advisor = advisors[advisorIndex];
  const timestamp = new Date().toISOString();

  const record = {
    scanNumber,
    advisorId: advisor.id,
    advisorName: advisor.name,
    timestamp,
  };

  // El correlativo ya quedó reservado. Estas operaciones actualizan
  // las métricas y el historial asociado a la asignación.
  await Promise.all([
    redis.incr(`contacto:advisor:${advisor.id}:assigned`),
    redis.lpush(RECENT_KEY, JSON.stringify(record)),
  ]);
  await redis.ltrim(RECENT_KEY, 0, HISTORY_LIMIT - 1);

  return {
    scanNumber,
    advisor,
    message,
    timestamp,
    whatsappUrl: `https://wa.me/${advisor.phone}?text=${encodeURIComponent(message)}`,
  };
}

export async function getDistributionSnapshot({ recentLimit = 20 } = {}) {
  const redis = getRedis();
  const { advisors, message } = getConfig();

  const [totalRaw, ...assignedRaw] = await Promise.all([
    redis.get(TOTAL_KEY),
    ...advisors.map((advisor) =>
      redis.get(`contacto:advisor:${advisor.id}:assigned`)
    ),
  ]);

  const total = Number(totalRaw || 0);
  const recentRaw =
    recentLimit > 0
      ? await redis.lrange(RECENT_KEY, 0, Math.max(0, recentLimit - 1))
      : [];

  const recent = recentRaw
    .map((item) => {
      try {
        return typeof item === "string" ? JSON.parse(item) : item;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const assignments = advisors.map((advisor, index) => {
    const assigned = Number(assignedRaw[index] || 0);
    return {
      ...advisor,
      assigned,
      percentage: total > 0 ? (assigned / total) * 100 : 0,
    };
  });

  const nextAdvisor = advisors[total % advisors.length];

  return {
    total,
    message,
    assignments,
    recent,
    nextAdvisor,
    mode: "round-robin",
  };
}

export async function getRecentAssignments(limit = 1000) {
  const redis = getRedis();
  const raw = await redis.lrange(RECENT_KEY, 0, Math.max(0, limit - 1));

  return raw
    .map((item) => {
      try {
        return typeof item === "string" ? JSON.parse(item) : item;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}
