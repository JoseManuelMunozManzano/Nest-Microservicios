# products-ms

Para NATS.

## Cambiar de TCP a NATS

https://docs.nestjs.com/microservices/nats

Hacemos la instalación en el microservicio products-ms: `npm i nats`

Hacemos un cambio en la forma en la que hemos configurado nuestro microservice para que use el transporte de NATS. Tenemos que usar los servers, donde lo suyo es que la ruta indicada venga de una variable de entorno.

Modificamos, por tanto, `main.ts`, `.env`, `.env.template` y `envs.ts`.

En nuestro fuente `products.controller`, los `@MessagePattern({ cmd: ProductTCP.CREATE })` como objeto van a funcionar, pero NATS pide un string.

Una vez hechos estos cambios veremos que las peticiones, en Postman, no funcionan. Esto es porque no tenemos este canal de comunicación en nuestro Gateway. Lo tenemos que cambiar, a NATS, en el Gateway también.

## Testing

- Clonar el repositorio
- Instalar dependencias
- Crear un archivo `.env` basado en `env.template`
- Ejecutar migración de Prisma `npx prisma migrate dev`
- Ejecutar `npm run start:dev`

En la carpeta `scripts` hay un archivo `products.sql` con 50 productos para insertar en la BD. Yo estoy usando la extensión `SQLite` de VSCode para trabajar con BBDD SQLite.
