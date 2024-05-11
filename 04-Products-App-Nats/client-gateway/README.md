# client-gateway

Para NATS.

## Cambiar de TCP a NATS

Vamos a hacer el cambio de nuestro Gateway para que hable con nuestro servidor de NATS, y este a su vez hable con el microservicio Productos.

https://docs.nestjs.com/microservices/nats

Hacemos la instalación en el microservicio products-ms: `npm i nats`

Para hacer la configuración vamos a hacer un módulo personalizado que nos sirva para hacer la importación fácilmente, y tenerlo centralizado en un único lugar.

Tocamos los fuentes `config/services.ts`, `.env`, `.env.template`, `config/envs.ts`, `products/products.module.ts` y `products/products.controller.ts`.

Para que nos funcione por ahora, comentamos las options de la configuración del ClientsModule en `orders/orders.module.ts`.

Con esto, ya funcionan las peticiones de productos desde Postman.

Mirar que ya no vamos directamente desde nuestro Gateway al microservicio de Productos, sino desde el Gateway al servidor de NATS, y de este al microservicio de Productos.

Y, si vamos al navegador, a la ruta `http://192.168.1.41:8222/connz`, veremos dos clientes conectados, nuestro Gateway y el microservicio de Productos.

## NatsModule - Módulo Personalizado

Vamos a realizar una refactorización.

Vamos a agrupar la conexión y configuración de nuestro NATS Server a un módulo personalizado.

Es esta parte la que vamos a refactorizar:

```
ClientsModule.register([
  {
    name: NATS_SERVICE,
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers,
    },
  },
]),
```

Para eso, usaremos nuestro Nest CLI. En la terminal escribimos: `nest g mo nats`

Se creará una carpeta `nats` que vamos a renombrar a `transports` por si el día de mañana tenemos distintos tipos de transporte, como gRPG... y un módulo `nats.module.ts` que dejamos tal cual. Si el día de mañana tenemos otros transportes, solo crearemos los distintos módulos de transporte.

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
