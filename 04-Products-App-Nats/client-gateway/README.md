# client-gateway

Para NATS.

## Testing

- Clonar el repositorio
- Instalar dependencias
- Ejecutar `npm run start:dev`
- Levantar de manera independiente el proyecto products-ms usando también Peacock para diferenciar el espacio de trabajo: `npm run start:dev`
- Levantar de manera independiente el proyecto orders-ms usando también Peacock para diferenciar el espacio de trabajo: `npm run start:dev`

Postman:

En la carpeta del root `postman` dejo:

- Los ejemplos de rutas a ejecutar para hacer POST, GET, PATCH y DELETE a products.
- Los ejemplos de rutas a ejecutar para hacer POST y GET a orders.
