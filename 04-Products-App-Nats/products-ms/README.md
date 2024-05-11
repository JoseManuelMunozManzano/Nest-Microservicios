# products-ms

Para NATS.

## Testing

- Clonar el repositorio
- Instalar dependencias
- Crear un archivo `.env` basado en `env.template`
- Ejecutar migración de Prisma `npx prisma migrate dev`
- Ejecutar `npm run start:dev`

En la carpeta `scripts` hay un archivo `products.sql` con 50 productos para insertar en la BD. Yo estoy usando la extensión `SQLite` de VSCode para trabajar con BBDD SQLite.
