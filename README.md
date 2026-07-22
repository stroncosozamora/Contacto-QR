# Contacto QR — WhatsApp rotativo

Aplicación Next.js desplegable en Vercel que distribuye contactos de WhatsApp en orden correlativo estricto entre asesores.

## Funcionamiento

- Cada visita al dominio principal obtiene un número correlativo mediante `INCR` en Redis.
- La asignación sigue la secuencia 1 → 2 → 1 → 2 sin selección aleatoria.
- El estado persiste aunque Vercel cambie o reinicie sus instancias.
- `/admin` muestra métricas, porcentajes, próxima asignación y registros recientes.
- `/api/status` entrega el estado en JSON.
- `/api/export` descarga hasta 1.000 asignaciones en CSV.
- Las rutas administrativas están protegidas con autenticación HTTP Basic.

## Variables de entorno

Configura en Vercel:

```env
WHATSAPP_1=56978088523
WHATSAPP_1_NAME=Sebastián
WHATSAPP_2=56948850826
WHATSAPP_2_NAME=Fernanda
WHATSAPP_MESSAGE=Hola, me gustaría tener más información.

ADMIN_USER=admin
ADMIN_PASSWORD=usa-una-clave-robusta
```

Redis acepta cualquiera de estos pares:

```env
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

O:

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Instalación

```bash
npm install
npm run dev
```

Para compilar:

```bash
npm run build
npm start
```

## Despliegue

1. Sube el contenido de esta carpeta a la raíz del repositorio.
2. Conecta el repositorio a Vercel.
3. Agrega las variables de entorno.
4. Conecta Upstash Redis o agrega sus credenciales manualmente.
5. Ejecuta un nuevo despliegue.

## Rutas

- `/`: asigna y redirige a WhatsApp.
- `/admin`: panel protegido.
- `/api/status`: estado JSON protegido.
- `/api/export`: CSV protegido.

## Consideración operativa

Cada solicitud al dominio principal consume una asignación. Algunos lectores QR, navegadores o sistemas de previsualización pueden abrir enlaces automáticamente. Conviene probar el QR en los dispositivos que se utilizarán antes de imprimirlo masivamente.
