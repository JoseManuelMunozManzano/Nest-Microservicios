# orders-ms

Para NATS.

## Orders Microservice - Cambiar de TCP a NATS

Como estamos por NATS solo hay que hacer una configuración, aunque desde las órdenes hay que confirmar que los ids de productos existen.

https://docs.nestjs.com/microservices/nats

Hacemos la instalación en el microservicio products-ms: `npm i nats`

Hacemos un cambio en la forma en la que hemos configurado nuestro microservice para que use el transporte de NATS. Tenemos que usar los servers, donde lo suyo es que la ruta indicada venga de una variable de entorno.

Modificamos, por tanto, `main.ts`, `.env`, `.env.template`, `envs.ts`, `services.ts` y `orders.module.ts`.

Copiamos desde nuestro `client-gateway` la carpeta `transports` a nuestro microservicio `orders-ms`. Modificamos `orders.service.ts`

## Testing

- Clonar el repositorio
- Instalar dependencias
- Crear un archivo `.env` basado en `env.template`
- Levantar la base de datos en Raspberry Pi
  - Ir a la ruta `/home/pi/docker/postgresql/orders-ms` y ejecutar `docker compose up -d`
- Ejecutar migración de Prisma `npx prisma migrate dev`
- Ejecutar `npm run start:dev`
