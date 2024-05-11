# orders-ms

Para NATS.

## Testing

- Clonar el repositorio
- Instalar dependencias
- Crear un archivo `.env` basado en `env.template`
- Levantar la base de datos en Raspberry Pi
  - Ir a la ruta `/home/pi/docker/postgresql/orders-ms` y ejecutar `docker compose up -d`
- Ejecutar migración de Prisma `npx prisma migrate dev`
- Ejecutar `npm run start:dev`
